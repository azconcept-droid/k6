import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './database/user.entity';

async function seed() {
  const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'app.db',
    entities: [User],
    synchronize: true,
  });

  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'admin@yalect.com' },
    });

    if (existingUser) {
      console.log('Default user already exists');
      await AppDataSource.destroy();
      return;
    }

    // Create default user
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    const user = new User();
    user.email = 'admin@yalect.com';
    user.password = hashedPassword;
    user.name = 'yalect';

    await userRepository.save(user);
    console.log('Default user created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
