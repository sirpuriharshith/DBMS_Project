INSERT INTO users(full_name,email,password_hash,role,phone) VALUES
('System Administrator','admin@rentora.com','pbkdf2$120000$rentora_demo$027595b04485420ada38675ad778ea6ae41bfb0409f3f782d6401d30b1a1f624','ADMIN','9000000001'),
('Rahul Sharma','owner@rentora.com','pbkdf2$120000$rentora_demo$027595b04485420ada38675ad778ea6ae41bfb0409f3f782d6401d30b1a1f624','OWNER','9000000002'),
('Asha Reddy','tenant@rentora.com','pbkdf2$120000$rentora_demo$027595b04485420ada38675ad778ea6ae41bfb0409f3f782d6401d30b1a1f624','TENANT','9000000003');

INSERT INTO amenities(name) VALUES
('WiFi'),('Parking'),('24x7 Security'),('Power Backup'),('Gym'),('Lift'),('Air Conditioning'),('Balcony');

INSERT INTO properties(owner_id,title,description,property_type,city,area,address,latitude,longitude,monthly_rent,bedrooms,bathrooms,furnished,image_url) VALUES
(2,'Skyline 2BHK','Modern apartment for working professionals with excellent connectivity, natural light and a comfortable layout.','APARTMENT','Hyderabad','Kondapur','Kondapur Main Road',17.4697,78.3762,28000,2,2,true,'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85'),
(2,'Green Valley 3BHK','Spacious family home near major technology campuses with parking, security and easy access to daily essentials.','HOUSE','Hyderabad','Gachibowli','Financial District Road',17.4401,78.3489,42000,3,3,true,'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85'),
(2,'Urban Studio','Compact furnished studio designed for students and young professionals who want easy access to Madhapur.','APARTMENT','Hyderabad','Madhapur','Near Metro Station',17.4483,78.3915,18000,1,1,true,'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85'),
(2,'Palm Grove Villa','Quiet villa portion with generous living space in a family-friendly residential locality.','VILLA','Hyderabad','Manikonda','Lanco Hills Road',17.4020,78.3784,30000,2,2,false,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'),
(2,'Metro View 2BHK','Value-focused apartment close to public transport, shopping areas and everyday services.','APARTMENT','Hyderabad','Kukatpally','KPHB Main Road',17.4933,78.3994,22000,2,2,false,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85'),
(2,'The Grand 3BHK','Premium apartment with elegant interiors, family-friendly spaces and high-end amenities.','APARTMENT','Hyderabad','Nanakramguda','Nanakramguda Junction',17.4206,78.3428,55000,3,3,true,'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85');

INSERT INTO property_amenities(property_id,amenity_id)
SELECT p.property_id,a.amenity_id FROM properties p JOIN amenities a ON a.name IN ('WiFi','Parking','24x7 Security')
WHERE p.property_id IN(1,2,3,4,5,6);

INSERT INTO bookings(property_id,tenant_id,start_date,end_date,monthly_rent,booking_amount,status)
VALUES(1,3,CURRENT_DATE,CURRENT_DATE + INTERVAL '11 months',28000,2800,'CONFIRMED');

INSERT INTO payments(booking_id,amount,payment_method,transaction_ref,status,paid_at)
VALUES(1,2800,'DEMO','RENTORA-DEMO-001','SUCCESS',CURRENT_TIMESTAMP);

INSERT INTO rental_contracts(booking_id,contract_number,terms,tenant_signed,owner_signed,contract_status)
VALUES(1,'REN-2026-00001','Residential rental agreement covering monthly rent, responsible use, maintenance, payment schedule and mutually agreed termination conditions.',TRUE,TRUE,'ACTIVE');

INSERT INTO activities(user_id,action,description) VALUES
(1,'SYSTEM','Rentora database initialized'),
(2,'PROPERTY','Owner published Skyline 2BHK'),
(2,'PROPERTY','Owner published Green Valley 3BHK'),
(3,'BOOKING','Tenant completed booking workflow'),
(3,'PAYMENT','Tenant completed demo payment'),
(3,'CONTRACT','Digital contract created');
