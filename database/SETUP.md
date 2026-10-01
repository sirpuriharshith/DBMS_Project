# Database setup

1. Open pgAdmin.
2. Create a database named `rentora_db`.
3. Open Query Tool for `rentora_db`.
4. Run `schema.sql`.
5. Run `seed.sql`.
6. Verify with:

SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM properties;
SELECT COUNT(*) FROM bookings;
SELECT COUNT(*) FROM payments;

Expected seeded counts: 3 users, 6 properties, 1 booking, 1 payment.
