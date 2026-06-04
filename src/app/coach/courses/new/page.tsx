import { sportService } from '@services/sport.service';
import CourseCreateWizard from '@features/coach-cms/CourseCreateWizard';

export const metadata = { title: 'Tạo khoá học mới' };

export default async function CoachCreateCoursePage() {
  const sports = await sportService.list();
  return <CourseCreateWizard sports={sports} />;
}
