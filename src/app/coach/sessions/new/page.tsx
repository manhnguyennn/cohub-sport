import { sportService } from '@services/sport.service';
import OpenSessionCreateWizard from '@features/coach-cms/OpenSessionCreateWizard';

export const metadata = { title: 'Mở lịch dạy mới' };

export default async function CoachSessionNewPage() {
  const sports = await sportService.list();
  return <OpenSessionCreateWizard sports={sports} />;
}
