SELECT property_id,title,city,area,monthly_rent FROM properties WHERE status='AVAILABLE' ORDER BY monthly_rent;
SELECT property_type,ROUND(AVG(monthly_rent),2) AS average_rent FROM properties GROUP BY property_type ORDER BY average_rent DESC;
SELECT u.full_name AS owner,COUNT(p.property_id) AS listing_count FROM users u LEFT JOIN properties p ON p.owner_id=u.user_id WHERE u.role='OWNER' GROUP BY u.user_id,u.full_name;
SELECT u.full_name AS tenant,p.title,b.start_date,b.status FROM bookings b JOIN users u ON u.user_id=b.tenant_id JOIN properties p ON p.property_id=b.property_id;
SELECT COALESCE(SUM(amount),0) AS successful_revenue FROM payments WHERE status='SUCCESS';
SELECT p.title,u.full_name AS tenant,b.status,COALESCE(SUM(pay.amount),0) AS paid_amount FROM bookings b JOIN properties p ON p.property_id=b.property_id JOIN users u ON u.user_id=b.tenant_id LEFT JOIN payments pay ON pay.booking_id=b.booking_id GROUP BY p.title,u.full_name,b.status ORDER BY paid_amount DESC;
SELECT c.contract_number,p.title,c.tenant_signed,c.owner_signed,c.contract_status FROM rental_contracts c JOIN bookings b ON b.booking_id=c.booking_id JOIN properties p ON p.property_id=b.property_id;
SELECT property_type,COUNT(*) AS bookings FROM bookings b JOIN properties p ON p.property_id=b.property_id GROUP BY property_type ORDER BY bookings DESC;
