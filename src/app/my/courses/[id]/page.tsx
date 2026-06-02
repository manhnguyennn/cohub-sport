import MyCourseDetailClient from '@features/courses/MyCourseDetailClient';

export const metadata = { title: 'Chi tiết khoá học' };

type PageProps = { params: { id: string } };

export default function MyCourseDetailPage({ params }: PageProps) {
  return <MyCourseDetailClient enrollmentId={params.id} />;
}
