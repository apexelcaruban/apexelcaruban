// Fungsi Netlify: webhook Form Sewa (2026-11-09).
// Jalur: /api/booking
//   POST {token, nama, barang, durasi, tanggal, jam, catatan, estimasi}
//     → kiriman form dari pelanggan. Token = payload bertanda tangan
//       Ed25519 yang dibuat bot (kunci privat hanya di bot; kunci publik
//       tertanam di bawah — aman dipublikasikan). Dari token inilah
//       nomor pengisi diketahui, tanpa kolom nomor HP di form.
//   GET  (header x-ts + x-sig dari bot) → daftar kiriman menunggu.
//   POST {mode:'ack', ids:[...]} (header sama) → hapus kiriman selesai.
//
// Kiriman disimpan di Netlify Blobs; bot di VM mengambilnya dengan
// polling keluar lalu membalas pelanggan via WhatsApp.

import { getStore } from '@netlify/blobs'
import crypto from 'node:crypto'

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAg1vtnQrOlz+fFGO1ReIQv31HFphAxMC6dShSmenJ7Ic=
-----END PUBLIC KEY-----`

const b64uDecode = (s) =>
   Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64')

function verifyToken(token) {
   try {
      const [payloadB64, sigB64] = String(token || '').split('.')
      if (!payloadB64 || !sigB64) return null
      const ok = crypto.verify(null, Buffer.from(payloadB64), PUBLIC_KEY, b64uDecode(sigB64))
      if (!ok) return null
      const payload = JSON.parse(b64uDecode(payloadB64).toString('utf8'))
      if (!payload.j || !/^\d{8,16}$/.test(String(payload.j))) return null
      if (!payload.e || payload.e < Math.floor(Date.now() / 1000)) return null
      return payload
   } catch {
      return null
   }
}

function verifyBotAuth(req) {
   try {
      const ts = req.headers.get('x-ts')
      const sig = req.headers.get('x-sig')
      if (!ts || !sig) return false
      if (Math.abs(Math.floor(Date.now() / 1000) - Number(ts)) > 300) return false
      return crypto.verify(null, Buffer.from(`booking:${ts}`), PUBLIC_KEY, b64uDecode(sig))
   } catch {
      return false
   }
}

const clean = (v, max) => String(v ?? '').trim().slice(0, max)
const json = (obj, status = 200) =>
   new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req) => {
   const store = getStore('form-bookings')

   if (req.method === 'GET') {
      if (!verifyBotAuth(req)) return json({ ok: false, error: 'unauthorized' }, 401)
      const { blobs } = await store.list({ prefix: 'sub-' })
      const items = []
      for (const b of blobs) {
         const item = await store.get(b.key, { type: 'json' })
         if (item) items.push(item)
      }
      return json({ ok: true, items })
   }

   if (req.method === 'POST') {
      let body
      try {
         body = await req.json()
      } catch {
         return json({ ok: false, error: 'bad json' }, 400)
      }

      if (body.mode === 'ack') {
         if (!verifyBotAuth(req)) return json({ ok: false, error: 'unauthorized' }, 401)
         const ids = Array.isArray(body.ids) ? body.ids.slice(0, 50) : []
         for (const id of ids) {
            if (/^sub-[\w-]+$/.test(String(id))) await store.delete(String(id))
         }
         return json({ ok: true, acked: ids.length })
      }

      const payload = verifyToken(body.token)
      if (!payload) return json({ ok: false, error: 'invalid token' }, 403)

      const data = {
         nama: clean(body.nama, 60),
         barang: clean(body.barang, 140),
         barangNama: clean(body.barangNama, 80),
         barangIsi: clean(body.barangIsi, 120),
         harga: clean(body.harga, 30),
         durasi: clean(body.durasi, 20),
         tanggal: clean(body.tanggal, 40),
         jam: clean(body.jam, 20),
         catatan: clean(body.catatan, 300),
         estimasi: clean(body.estimasi, 30)
      }
      if (!data.nama || !data.barang || !data.tanggal) {
         return json({ ok: false, error: 'incomplete' }, 400)
      }

      const id = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      await store.setJSON(id, {
         id,
         jid: String(payload.j),
         data,
         receivedAt: new Date().toISOString()
      })
      return json({ ok: true, id })
   }

   return json({ ok: false, error: 'method not allowed' }, 405)
}

export const config = { path: '/api/booking' }
