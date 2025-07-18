export class CreateAdminDto {
  name: string;
  email: string;
  password: string; // ในโปรเจคจริงควรใช้ class-validator เพื่อตรวจสอบข้อมูล
}