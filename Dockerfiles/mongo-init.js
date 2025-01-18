db = db.getSiblingDB('jobdatabase'); 
db.createUser({
  user: 'user',
  pwd: 'password123',
  roles: [
    {
      role: 'readWrite',
      db: 'jobdatabase',
    },
  ],
});

print('Database and user created successfully!');
