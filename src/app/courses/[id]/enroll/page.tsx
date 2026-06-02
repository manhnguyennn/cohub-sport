import { notFound } from 'next/navigation';
import { courseService } from '@services/course.service';
import CourseEnrollClient from '@features/courses/CourseEnrollClient';

export const metadata = { title: 'Đăng ký khoá học' };

type PageProps = { params: { id: string } };

export default async function CourseEnrollPage({ params }: PageProps) {
  let course;
  try {
    course = await courseService.getById(params.id);
  } catch {
    notFound();
  }

  return <CourseEnrollClient course={course} />;
}
