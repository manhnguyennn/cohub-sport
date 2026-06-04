/**
 * Import file này để đăng ký tất cả mock handlers vào registry.
 * apiClient sẽ tự resolve theo "METHOD /path".
 *
 * Lưu ý: file này CHỈ được import ở 1 chỗ — root layout (server side OK).
 * Component KHÔNG được import trực tiếp từ src/mocks/.
 */
import './sports.mock';
import './coaches.mock';
import './reviews.mock';
import './promo.mock';      // ← phải before bookings (bookings dùng promoMocks)
import './payment.mock';
import './bookings.mock';
import './openSession.mock';   // ← Lịch dạy mở (sau bookings để có denormCoach helper sẵn)
import './courses.mock';
import './onboarding.mock';
import './dashboard.mock';
import './auth.mock';
