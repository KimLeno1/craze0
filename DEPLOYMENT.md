# Closet Kraze: Production Integration & Deployment Blueprint

This document outlines the elite protocols required to move **Closet Kraze** from a local neural simulation to a global, high-conversion production environment.

---

## 1. Database Architecture (The Archive Core)

To maintain the "Velocity Heat" and "Scarcity" integrity, we must replace `databaseService.ts` with a real-time provider. **Supabase** is the recommended choice.

### Schema Requirements
- **Profiles Table**: Stores `handle`, `rep`, `archetype`, and `rank_tier`. Use Row Level Security (RLS) to ensure users can only modify their own dossier.
- **Inventory Table**: Real-time `stock_count` and `hype_score`. Use PostgreSQL Listen/Notify to push inventory drops to the frontend instantly.
- **Orders Table**: Linked to the payment provider `reference_id`.

### Sync Implementation
```typescript
// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const syncInventory = (callback: Function) => {
  supabase
    .channel('public:inventory')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory' }, 
        payload => callback(payload.new))
    .subscribe();
};
```

---

## 2. Payment Protocol (Transaction Handshake)

For the GH₵ (Ghana Cedi) ecosystem, **Paystack** is the authorized gateway.

### Integration Steps
1.  **Initialize**: Call the Paystack API from an Edge Function when the user clicks "Initialize Uplink Acquisition."
2.  **Checkout**: Use Paystack Popup for zero-friction mobile-first payments.
3.  **Verification**: Implement a Webhook to listen for `charge.success`.

### Secure Logic
```typescript
// api/verify-acquisition.ts (Edge Function)
export default async function handler(req, res) {
  const { reference } = req.body;
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  });
  
  const data = await response.json();
  if (data.data.status === 'success') {
    // 1. Update Inventory Count (Atomic Decrement)
    // 2. Award REP points to Profile
    // 3. Trigger "Haul Secured" animation
  }
}
```

---

## 3. Gemini API Security (Neural Link Integrity)

The `API_KEY` is currently obtained via `process.env.API_KEY`. 

### Production Environment Variable Configuration:
- **Vercel/Netlify**: Navigate to Settings > Environment Variables.
- **Key**: `API_KEY`
- **Value**: Your production Google GenAI key.

### Optimization for Deployment:
- **Streaming**: Ensure `generateContentStream` is used for the "Trend Oracle" to minimize Time-to-First-Token (TTFT), keeping the UX "Speed as a Feature" principle.
- **Safety Settings**: Configure the SDK to "BLOCK_NONE" for fashion-related queries to ensure the "Provocative" brand tone is never filtered by aggressive safety presets.

---

## 4. Deployment Pipeline (Global Circuit)

### Vercel Deployment (Recommended)
1.  **Link Repository**: Connect your GitHub/GitLab repo.
2.  **Framework Preset**: Select `Vite` or `Create React App`.
3.  **Install Command**: `npm install`.
4.  **Build Command**: `npm run build`.
5.  **Output Directory**: `dist`.

### Performance Checklist
- [ ] **Image Optimization**: Host high-res silhouettes on a CDN (Cloudinary/Vercel Images).
- [ ] **Skeleton Loaders**: Ensure `ProductCard` and `Profile` use high-contrast skeleton states during data hydration.
- [ ] **Service Workers**: Enable offline caching for the "Archive" to preserve immersion during network fluctuations.

---

## 5. Psychological Calibration

Before going live, verify the following sales triggers:
- **Timer Integrity**: Ensure `surgeTimerEnd` is synchronized with the server time, not the user's local clock, to prevent "Time Hacking."
- **Social Proof Density**: Adjust the `SocialProofPopup` frequency to match real regional traffic patterns.
- **Velocity Glow**: Verify that items with `stockCount < 5` trigger the `Critical Inventory` kinetic pulse.

---

**Execution Directive:** Deploy relentlessly. The circuit never waits.