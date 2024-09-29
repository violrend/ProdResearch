import bcrypt from 'bcryptjs';
import dynamodb from '@/lib/dynamodb'; // Assuming you have this file that exports a DynamoDB client

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: 'Users',
      Item: {
        email: email,  // Primary key
        name: name,
        password: hashedPassword, // Save the hashed password instead of plain text
      },
    };

    try {
      // Save the user to DynamoDB
      await dynamodb.put(params).promise();
      res.status(200).json({ message: 'User data saved successfully' });
    } catch (error) {
      console.error('Error saving user data:', error);
      res.status(500).json({ error: 'Error saving user data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}