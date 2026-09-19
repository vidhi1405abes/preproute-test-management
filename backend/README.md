# PrepRoute Backend

Ye ek fresh, chota Express backend hai jo `preproute-test-management` frontend
ko chalane ke liye banaya gaya hai — kyunki purane backend ka code kahin commit
nahi hua tha aur uske login credentials bhi khatam ho chuke the.

## Setup

```
cd backend
npm install
npm run dev
```

Server `http://localhost:5000` par chalega. Pehli baar chalane par ye khud
`data/db.json` file bana lega (isse delete mat karna agar tests/questions save
rakhne hain).

## Default login (pehli baar)

```
User ID: admin
Password: admin123
```

Isse login karke tum turant dashboard tak pahunch jaoge. Agar chaho to Signup
page se apna khud ka naya account bhi bana sakte ho — wo bhi ab kaam karta hai.

## Kya-kya bana hai

- `POST /api/auth/login` — login
- `POST /api/auth/signup` — naya account banao (pehle ye tha hi nahi)
- `GET/POST/PUT /api/tests` — tests CRUD
- `POST /api/questions/bulk`, `POST /api/questions/fetchBulk`
- `GET /api/subjects`, `GET /api/topics/subject/:id`, `GET /api/sub-topics/topic/:id`

Sab `/api/tests`, `/api/questions`, `/api/subjects...` routes protected hain —
inhe call karne ke liye login se mila hua token chahiye (frontend ye khud
handle kar leta hai localStorage se).

Data ek JSON file (`data/db.json`) mein store hota hai — koi Postgres/Mongo
install karne ki zaroorat nahi. Jab chaaho asli database pe migrate kar sakte ho.
