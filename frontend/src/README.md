# FreelanceTaxPlanner

Small, focused full-stack app to track freelancer income/expenses in **INR (₹)** with monthly totals and a simple yearly tax estimate.

## Why

Freelancers often track earnings/spend across months and need a quick profit view and rough tax estimate without complex accounting software.

## Tech

- **Frontend:** React 17 (CRA), Axios
- **Backend:** Node.js (Express), MongoDB (Mongoose)
- **Base currency:** INR (₹), no external FX API (keeps MVP simple)
- **Analytics:** `/analytics/monthly`, `/analytics/yearly` (flat tax via env)

## Run Locally

### Backend

```bash
cd backend
cp .env.example .env # if you make one
# Or set:
# PORT=4002
# MONGO_URI=mongodb://127.0.0.1:27017/freelancetaxplanner
# TAX_RATE_PERCENT=10
npm i
npm run dev
```
