INSERT INTO users (username, email, descrip, auth_id, admin)
VALUES ($1, $2, $3, $4, false)
RETURNING *;