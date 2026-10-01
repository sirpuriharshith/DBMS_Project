from app.auth import hash_password, verify_password
s=hash_password("rentora-test")
assert verify_password("rentora-test", s)
assert not verify_password("wrong", s)
print("Rentora authentication smoke test: PASS")
