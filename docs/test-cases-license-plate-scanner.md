# TEST CASES - CHỨC NĂNG QUÉT BIỂN SỐ XE

## Thông tin chung
- **Chức năng**: License Plate Scanner (Quét biển số xe)
- **Phiên bản**: 1.0
- **Người thiết kế**: QA Team
- **Ngày tạo**: 2025-11-10

## Mục lục
1. [Functional Testing](#functional-testing) (40 test cases)
2. [Non-Functional Testing](#non-functional-testing) (15 test cases)
3. [Security Testing](#security-testing) (10 test cases)
4. [Usability Testing](#usability-testing) (5 test cases)

---

## FUNCTIONAL TESTING

### 1. Camera Access & Control (10 test cases)

#### TC_CAM_001: Kiểm tra yêu cầu quyền truy cập camera
- **Mục đích**: Xác minh hệ thống yêu cầu quyền camera từ browser
- **Điều kiện tiên quyết**: User đã đăng nhập, chưa cấp quyền camera
- **Các bước thực hiện**:
  1. Truy cập trang License Plate Scanner
  2. Quan sát popup yêu cầu quyền
- **Kết quả mong đợi**: 
  - Browser hiển thị popup yêu cầu quyền camera
  - Có nút Allow/Deny
- **Mức độ ưu tiên**: High

#### TC_CAM_002: Cho phép quyền truy cập camera
- **Mục đích**: Xác minh camera hoạt động khi user cho phép
- **Điều kiện tiên quyết**: TC_CAM_001 passed
- **Các bước thực hiện**:
  1. Click nút "Allow" trên popup quyền
  2. Chờ camera khởi động
- **Kết quả mong đợi**: 
  - Camera feed hiển thị real-time video
  - Không có error message
- **Mức độ ưu tiên**: High

#### TC_CAM_003: Từ chối quyền truy cập camera
- **Mục đích**: Xác minh xử lý khi user từ chối quyền
- **Điều kiện tiên quyết**: TC_CAM_001 passed
- **Các bước thực hiện**:
  1. Click nút "Deny" trên popup quyền
  2. Quan sát thông báo lỗi
- **Kết quả mong đợi**: 
  - Hiển thị error message rõ ràng
  - Có hướng dẫn cách cấp quyền lại
  - Hiển thị option upload ảnh thay thế
- **Mức độ ưu tiên**: High

#### TC_CAM_004: Chuyển đổi giữa camera trước/sau (mobile)
- **Mục đích**: Kiểm tra chức năng đổi camera trên thiết bị có nhiều camera
- **Điều kiện tiên quyết**: 
  - Thiết bị có ít nhất 2 camera
  - Camera permission đã được cấp
- **Các bước thực hiện**:
  1. Click nút "Switch Camera"
  2. Quan sát video feed
- **Kết quả mong đợi**: 
  - Video feed chuyển sang camera khác
  - Không bị giật lag
  - Không có error
- **Mức độ ưu tiên**: Medium

#### TC_CAM_005: Dừng camera feed
- **Mục đích**: Xác minh camera dừng đúng cách
- **Điều kiện tiên quyết**: Camera đang hoạt động
- **Các bước thực hiện**:
  1. Click nút "Stop Camera"
  2. Quan sát video feed
- **Kết quả mong đợi**: 
  - Video feed dừng lại
  - Camera LED tắt (nếu có)
  - Hiển thị option để start lại
- **Mức độ ưu tiên**: Medium

#### TC_CAM_006: Khởi động lại camera sau khi dừng
- **Mục đích**: Kiểm tra khả năng restart camera
- **Điều kiện tiên quyết**: TC_CAM_005 passed
- **Các bước thực hiện**:
  1. Click nút "Start Camera" sau khi đã stop
  2. Chờ camera khởi động
- **Kết quả mong đợi**: 
  - Camera hoạt động trở lại bình thường
  - Video feed hiển thị real-time
- **Mức độ ưu tiên**: Medium

#### TC_CAM_007: Chụp ảnh từ camera feed
- **Mục đích**: Xác minh chức năng capture snapshot
- **Điều kiện tiên quyết**: Camera đang hoạt động
- **Các bước thực hiện**:
  1. Di chuyển camera để hướng vào biển số xe
  2. Click nút "Capture" hoặc chờ auto-capture
- **Kết quả mong đợi**: 
  - Ảnh được chụp và hiển thị preview
  - Ảnh có độ phân giải phù hợp
  - Trigger quá trình nhận diện
- **Mức độ ưu tiên**: High

#### TC_CAM_008: Xử lý khi camera bị disconnect
- **Mục đích**: Kiểm tra error handling khi camera bị ngắt
- **Điều kiện tiên quyết**: Camera đang hoạt động
- **Các bước thực hiện**:
  1. Ngắt kết nối camera (unplug hoặc disable)
  2. Quan sát thông báo lỗi
- **Kết quả mong đợi**: 
  - Hiển thị error message rõ ràng
  - Không crash app
  - Có option để retry
- **Mức độ ưu tiên**: High

#### TC_CAM_009: Kiểm tra camera constraints (resolution, framerate)
- **Mục đích**: Xác minh camera settings được apply đúng
- **Điều kiện tiên quyết**: Camera đang hoạt động
- **Các bước thực hiện**:
  1. Kiểm tra resolution của video feed
  2. Kiểm tra framerate
- **Kết quả mong đợi**: 
  - Resolution tối thiểu 720p
  - Framerate ổn định (không dưới 15fps)
- **Mức độ ưu tiên**: Medium

#### TC_CAM_010: Fullscreen mode
- **Mục đích**: Kiểm tra chế độ toàn màn hình
- **Điều kiện tiên quyết**: Camera đang hoạt động
- **Các bước thực hiện**:
  1. Click nút "Fullscreen"
  2. Quan sát UI
  3. Thoát fullscreen
- **Kết quả mong đợi**: 
  - Video feed mở rộng toàn màn hình
  - Controls vẫn hiển thị
  - Thoát fullscreen hoạt động bình thường
- **Mức độ ưu tiên**: Low

---

### 2. Image Upload (10 test cases)

#### TC_IMG_001: Upload ảnh từ device
- **Mục đích**: Xác minh chức năng upload ảnh
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Click nút "Upload Image"
  2. Chọn file ảnh hợp lệ (.jpg, .png)
  3. Confirm upload
- **Kết quả mong đợi**: 
  - Ảnh được upload và hiển thị preview
  - Trigger quá trình nhận diện
  - Progress indicator hiển thị
- **Mức độ ưu tiên**: High

#### TC_IMG_002: Upload ảnh định dạng không hỗ trợ
- **Mục đích**: Kiểm tra validation file format
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Click nút "Upload Image"
  2. Chọn file không phải ảnh (.pdf, .txt, .doc)
- **Kết quả mong đợi**: 
  - Hiển thị error message
  - File không được upload
  - Liệt kê các format được hỗ trợ
- **Mức độ ưu tiên**: High

#### TC_IMG_003: Upload ảnh quá dung lượng tối đa (>10MB)
- **Mục đích**: Kiểm tra validation file size
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Click nút "Upload Image"
  2. Chọn file ảnh > 10MB
- **Kết quả mong đợi**: 
  - Hiển thị error "Image too large (max 10MB)"
  - File không được upload
- **Mức độ ưu tiên**: High

#### TC_IMG_004: Upload nhiều ảnh liên tiếp
- **Mục đích**: Kiểm tra khả năng xử lý nhiều uploads
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Upload ảnh thứ nhất
  2. Chờ kết quả
  3. Upload ảnh thứ hai ngay lập tức
- **Kết quả mong đợi**: 
  - Cả hai ảnh đều được xử lý
  - Không có conflict
  - Results hiển thị đúng thứ tự
- **Mức độ ưu tiên**: Medium

#### TC_IMG_005: Cancel upload đang thực hiện
- **Mục đích**: Kiểm tra chức năng hủy upload
- **Điều kiện tiên quyết**: 
  - User đang upload ảnh lớn
  - Upload chưa hoàn thành
- **Các bước thực hiện**:
  1. Bắt đầu upload ảnh lớn
  2. Click nút "Cancel" khi đang upload
- **Kết quả mong đợi**: 
  - Upload bị hủy
  - Không gửi request nhận diện
  - UI reset về trạng thái ban đầu
- **Mức độ ưu tiên**: Medium

#### TC_IMG_006: Upload ảnh có EXIF data
- **Mục đích**: Xác minh xử lý metadata
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Upload ảnh có EXIF data (location, timestamp)
  2. Kiểm tra data được lưu
- **Kết quả mong đợi**: 
  - Ảnh được upload thành công
  - EXIF data được xử lý an toàn
  - Không leak sensitive info
- **Mức độ ưu tiên**: High

#### TC_IMG_007: Drag and drop ảnh
- **Mục đích**: Kiểm tra chức năng kéo thả
- **Điều kiện tiên quyết**: User đã đăng nhập, sử dụng desktop
- **Các bước thực hiện**:
  1. Drag file ảnh từ file explorer
  2. Drop vào drop zone
- **Kết quả mong đợi**: 
  - Ảnh được upload và xử lý
  - Drop zone highlight khi drag over
  - Same validation như manual upload
- **Mức độ ưu tiên**: Low

#### TC_IMG_008: Upload ảnh từ clipboard (paste)
- **Mục đích**: Kiểm tra paste ảnh từ clipboard
- **Điều kiện tiên quyết**: User đã đăng nhập, có ảnh trong clipboard
- **Các bước thực hiện**:
  1. Copy ảnh vào clipboard
  2. Focus vào input area
  3. Ctrl+V (Cmd+V on Mac)
- **Kết quả mong đợi**: 
  - Ảnh từ clipboard được paste và upload
  - Validation được áp dụng
- **Mức độ ưu tiên**: Low

#### TC_IMG_009: Upload ảnh bị corrupt
- **Mục đích**: Kiểm tra xử lý file corrupt
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Upload file ảnh bị corrupt/damaged
  2. Quan sát error handling
- **Kết quả mong đợi**: 
  - Hiển thị error message rõ ràng
  - Không crash app
  - Suggest user upload ảnh khác
- **Mức độ ưu tiên**: Medium

#### TC_IMG_010: Retry upload khi failed
- **Mục đích**: Kiểm tra chức năng retry
- **Điều kiện tiên quyết**: Upload bị fail (network error)
- **Các bước thực hiện**:
  1. Simulate network failure
  2. Upload ảnh
  3. Click "Retry" khi fail
- **Kết quả mong đợi**: 
  - Upload được thử lại
  - Không cần chọn file lại
  - Success sau khi network recovered
- **Mức độ ưu tiên**: Medium

---

### 3. License Plate Recognition (15 test cases)

#### TC_REC_001: Nhận diện biển số chuẩn Việt Nam (##X-###.##)
- **Mục đích**: Kiểm tra nhận diện format biển số phổ biến
- **Điều kiện tiên quyết**: 
  - Có ảnh biển số format 51F-238.91
  - Image quality tốt
- **Các bước thực hiện**:
  1. Upload/Capture ảnh biển số 51F-238.91
  2. Chờ nhận diện hoàn thành
- **Kết quả mong đợi**: 
  - Nhận diện đúng: "51F-238.91"
  - Confidence >= 0.8
  - Hiển thị kết quả trong 3-5s
- **Mức độ ưu tiên**: Critical

#### TC_REC_002: Nhận diện biển số không có dấu chấm (##X-####)
- **Mục đích**: Kiểm tra nhận diện format không có dots
- **Điều kiện tiên quyết**: Có ảnh biển số format 43A-12345
- **Các bước thực hiện**:
  1. Upload ảnh biển số 43A-12345
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Nhận diện đúng: "43A-12345"
  - Confidence >= 0.75
- **Mức độ ưu tiên**: High

#### TC_REC_003: Nhận diện biển số không có dấu gạch (##X#####)
- **Mục đích**: Kiểm tra nhận diện format liền
- **Điều kiện tiên quyết**: Có ảnh biển số format 51F23891
- **Các bước thực hiện**:
  1. Upload ảnh biển số 51F23891
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Nhận diện đúng: "51F23891"
  - Confidence >= 0.7
- **Mức độ ưu tiên**: High

#### TC_REC_004: Nhận diện với ảnh chất lượng cao
- **Mục đích**: Xác minh accuracy với ảnh tốt
- **Điều kiện tiên quyết**: 
  - Ảnh độ phân giải cao (>= 1080p)
  - Ánh sáng tốt
  - Góc chụp trực diện
- **Các bước thực hiện**:
  1. Upload ảnh chất lượng cao
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Nhận diện chính xác 100%
  - Confidence >= 0.9
  - Processing time < 3s
- **Mức độ ưu tiên**: High

#### TC_REC_005: Nhận diện với ảnh chất lượng thấp
- **Mục đích**: Kiểm tra xử lý ảnh kém chất lượng
- **Điều kiện tiên quyết**: 
  - Ảnh độ phân giải thấp (<480p)
  - Bị blur/mờ
- **Các bước thực hiện**:
  1. Upload ảnh chất lượng thấp
  2. Quan sát warning/error
- **Kết quả mong đợi**: 
  - Hiển thị warning về image quality
  - Confidence thấp hoặc fail
  - Suggest chụp lại với quality tốt hơn
- **Mức độ ưu tiên**: High

#### TC_REC_006: Nhận diện với góc chụp nghiêng
- **Mục đích**: Kiểm tra xử lý perspective
- **Điều kiện tiên quyết**: Ảnh chụp góc nghiêng 30-45 độ
- **Các bước thực hiện**:
  1. Upload ảnh chụp nghiêng
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Vẫn nhận diện được (có thể sai một vài ký tự)
  - Confidence thấp hơn (<0.7)
  - Suggest chụp lại với góc thẳng
- **Mức độ ưu tiên**: Medium

#### TC_REC_007: Nhận diện với điều kiện ánh sáng kém
- **Mục đích**: Kiểm tra xử lý low light
- **Điều kiện tiên quyết**: Ảnh tối, thiếu sáng
- **Các bước thực hiện**:
  1. Upload ảnh chụp trong điều kiện tối
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Có thể nhận diện hoặc fail
  - Warning về lighting conditions
  - Suggest use flash hoặc tăng exposure
- **Mức độ ưu tiên**: Medium

#### TC_REC_008: Nhận diện với bóng che/partial occlusion
- **Mục đích**: Kiểm tra xử lý khi biển số bị che một phần
- **Điều kiện tiên quyết**: Biển số bị che 1-2 ký tự
- **Các bước thực hiện**:
  1. Upload ảnh biển số bị che một phần
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Nhận diện được phần không bị che
  - Confidence thấp
  - Show warning về occlusion
- **Mức độ ưu tiên**: Medium

#### TC_REC_009: Nhận diện biển số bị bẩn/mờ
- **Mục đích**: Kiểm tra xử lý biển số dirty
- **Điều kiện tiên quyết**: Biển số bị bụi/bùn che
- **Các bước thực hiện**:
  1. Upload ảnh biển số bẩn
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Có thể nhận diện được hoặc fail
  - Confidence thấp
  - Warning về dirty plate
- **Mức độ ưu tiên**: Medium

#### TC_REC_010: Nhận diện ảnh không có biển số xe
- **Mục đích**: Kiểm tra xử lý khi không detect được plate
- **Điều kiện tiên quyết**: Ảnh không chứa biển số xe
- **Các bước thực hiện**:
  1. Upload ảnh random (không có xe)
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Hiển thị "No license plate detected"
  - Confidence = 0
  - Suggest upload ảnh có biển số
- **Mức độ ưu tiên**: High

#### TC_REC_011: Nhận diện nhiều biển số trong cùng ảnh
- **Mục đích**: Kiểm tra xử lý multiple plates
- **Điều kiện tiên quyết**: Ảnh có 2+ biển số xe
- **Các bước thực hiện**:
  1. Upload ảnh có nhiều xe
  2. Chờ kết quả
- **Kết quả mong đợi**: 
  - Nhận diện được biển số rõ nhất
  - Hoặc show warning về multiple plates
  - Allow user chọn plate cần check
- **Mức độ ưu tiên**: Low

#### TC_REC_012: So sánh kết quả CNN vs AI methods
- **Mục đích**: Xác minh cả 2 methods hoạt động
- **Điều kiện tiên quyết**: 
  - System support cả CNN và AI methods
  - Có ảnh test
- **Các bước thực hiện**:
  1. Nhận diện với CNN method
  2. Nhận diện cùng ảnh với AI method
  3. So sánh results
- **Kết quả mong đợi**: 
  - Cả 2 methods cho kết quả tương đồng
  - AI có confidence cao hơn
  - CNN nhanh hơn
- **Mức độ ưu tiên**: Medium

#### TC_REC_013: Preprocessing ảnh trước khi nhận diện
- **Mục đích**: Xác minh image preprocessing hoạt động
- **Điều kiện tiên quyết**: Có ảnh màu, chưa được xử lý
- **Các bước thực hiện**:
  1. Upload ảnh màu
  2. Kiểm tra ảnh được convert sang grayscale
  3. Kiểm tra contrast enhancement
- **Kết quả mong đợi**: 
  - Ảnh được convert sang grayscale
  - Contrast được tăng cường
  - Accuracy cải thiện
- **Mức độ ưu tiên**: Medium

#### TC_REC_014: Text cleaning sau OCR
- **Mục đích**: Kiểm tra việc clean OCR output
- **Điều kiện tiên quyết**: OCR output chứa noise characters
- **Các bước thực hiện**:
  1. Nhận diện ảnh có noise
  2. Kiểm tra output đã cleaned
- **Kết quả mong đợi**: 
  - Noise characters được remove
  - Common OCR errors được fix (0→O, 1→I)
  - Format được normalize
- **Mức độ ưu tiên**: High

#### TC_REC_015: Timeout khi nhận diện quá lâu
- **Mục đích**: Kiểm tra timeout handling
- **Điều kiện tiên quyết**: 
  - Ảnh rất lớn hoặc complex
  - Processing > 30s
- **Các bước thực hiện**:
  1. Upload ảnh lớn/complex
  2. Chờ > 30s
- **Kết quả mong đợi**: 
  - Show timeout error sau 30s
  - Allow retry
  - Suggest optimize image
- **Mức độ ưu tiên**: Medium

---

### 4. Database Operations (5 test cases)

#### TC_DB_001: Lưu scan record vào database
- **Mục đích**: Xác minh scan được lưu đúng
- **Điều kiện tiên quyết**: 
  - User đã đăng nhập
  - Nhận diện thành công
- **Các bước thực hiện**:
  1. Nhận diện biển số thành công
  2. Kiểm tra database table license_plate_scans
- **Kết quả mong đợi**: 
  - Record mới được insert
  - user_id, plate_number, confidence đúng
  - scanned_at = current timestamp
- **Mức độ ưu tiên**: Critical

#### TC_DB_002: Validation data trước khi save
- **Mục đích**: Kiểm tra input validation
- **Điều kiện tiên quyết**: Có invalid data
- **Các bước thực hiện**:
  1. Attempt save với plate_number empty
  2. Attempt save với confidence > 1
  3. Attempt save với invalid device_type
- **Kết quả mong đợi**: 
  - Validation errors được throw
  - Data không được save
  - Error messages rõ ràng
- **Mức độ ưu tiên**: High

#### TC_DB_003: RLS policy - user chỉ thấy scans của mình
- **Mục đích**: Xác minh Row Level Security
- **Điều kiện tiên quyết**: 
  - Có nhiều users
  - Mỗi user có scans riêng
- **Các bước thực hiện**:
  1. Login as User A
  2. Query license_plate_scans
  3. Verify chỉ thấy scans của User A
- **Kết quả mong đợi**: 
  - User chỉ query được own scans
  - Không thấy scans của users khác
  - RLS policy enforce đúng
- **Mức độ ưu tiên**: Critical

#### TC_DB_004: Update scan record
- **Mục đích**: Kiểm tra update permissions
- **Điều kiện tiên quyết**: 
  - User có existing scan
  - User đã đăng nhập
- **Các bước thực hiện**:
  1. Attempt update own scan
  2. Attempt update scan của user khác
- **Kết quả mong đợi**: 
  - User update được own scans
  - User KHÔNG update được scans của người khác
  - RLS policy enforce đúng
- **Mức độ ưu tiên**: High

#### TC_DB_005: Delete scan record
- **Mục đích**: Kiểm tra delete permissions
- **Điều kiện tiên quyết**: 
  - User có existing scans
  - User đã đăng nhập
- **Các bước thực hiện**:
  1. Delete own scan
  2. Attempt delete scan của user khác
- **Kết quả mong đợi**: 
  - User delete được own scans
  - User KHÔNG delete được scans của người khác
  - Soft delete hoặc hard delete theo policy
- **Mức độ ưu tiên**: High

---

## NON-FUNCTIONAL TESTING

### 5. Performance Testing (5 test cases)

#### TC_PERF_001: Thời gian nhận diện với CNN method
- **Mục đích**: Đo response time của CNN
- **Điều kiện tiên quyết**: Ảnh test chuẩn (720p, good quality)
- **Các bước thực hiện**:
  1. Upload ảnh
  2. Select CNN method
  3. Measure time từ upload đến result
- **Kết quả mong đợi**: 
  - Response time < 3s
  - Consistent across multiple runs
- **Mức độ ưu tiên**: High

#### TC_PERF_002: Thời gian nhận diện với AI method
- **Mục đích**: Đo response time của AI
- **Điều kiện tiên quyết**: Ảnh test chuẩn (720p, good quality)
- **Các bước thực hiện**:
  1. Upload ảnh
  2. Select AI method
  3. Measure time từ upload đến result
- **Kết quả mong đợi**: 
  - Response time < 5s
  - Acceptable for edge function processing
- **Mức độ ưu tiên**: High

#### TC_PERF_003: Memory usage khi xử lý ảnh lớn
- **Mục đích**: Kiểm tra memory leaks
- **Điều kiện tiên quyết**: Ảnh lớn (5-10MB)
- **Các bước thực hiện**:
  1. Upload nhiều ảnh lớn liên tiếp (10-20 ảnh)
  2. Monitor browser memory
- **Kết quả mong đợi**: 
  - Memory không tăng liên tục
  - Garbage collection hoạt động
  - No memory leaks
- **Mức độ ưu tiên**: Medium

#### TC_PERF_004: Concurrent scan requests
- **Mục đích**: Kiểm tra xử lý multiple requests
- **Điều kiện tiên quyết**: 
  - Nhiều users (5-10)
  - Cùng lúc scan
- **Các bước thực hiện**:
  1. Simulate 5-10 concurrent scans
  2. Monitor response times
- **Kết quả mong đợi**: 
  - All requests được xử lý
  - Response time không tăng quá 2x
  - No errors
- **Mức độ ưu tiên**: Medium

#### TC_PERF_005: Camera frame rate
- **Mục đích**: Đo FPS của camera feed
- **Điều kiện tiên quyết**: Camera đang hoạt động
- **Các bước thực hiện**:
  1. Start camera
  2. Monitor FPS trong 60s
- **Kết quả mong đợi**: 
  - FPS >= 15
  - Stable, không fluctuate nhiều
- **Mức độ ưu tiên**: Low

---

### 6. Compatibility Testing (5 test cases)

#### TC_COMPAT_001: Chrome desktop (latest)
- **Mục đích**: Xác minh hoạt động trên Chrome
- **Điều kiện tiên quyết**: Chrome version >= 120
- **Các bước thực hiện**:
  1. Open app trên Chrome
  2. Test all scanner features
- **Kết quả mong đợi**: 
  - All features hoạt động bình thường
  - UI render đúng
  - No console errors
- **Mức độ ưu tiên**: Critical

#### TC_COMPAT_002: Safari mobile (iOS)
- **Mục đích**: Xác minh hoạt động trên Safari iOS
- **Điều kiện tiên quyết**: iPhone với iOS >= 15
- **Các bước thực hiện**:
  1. Open app trên Safari iOS
  2. Test camera access
  3. Test recognition
- **Kết quả mong đợi**: 
  - Camera permission hoạt động
  - Recognition hoạt động
  - UI responsive
- **Mức độ ưu tiên**: High

#### TC_COMPAT_003: Chrome mobile (Android)
- **Mục đích**: Xác minh hoạt động trên Chrome Android
- **Điều kiện tiên quyết**: Android device với Chrome
- **Các bước thực hiện**:
  1. Open app trên Chrome Android
  2. Test all features
- **Kết quả mong đợi**: 
  - All features hoạt động
  - Switch camera hoạt động
  - Performance acceptable
- **Mức độ ưu tiên**: High

#### TC_COMPAT_004: Firefox desktop
- **Mục đích**: Kiểm tra cross-browser compatibility
- **Điều kiện tiên quyết**: Firefox latest version
- **Các bước thực hiện**:
  1. Open app trên Firefox
  2. Test scanner features
- **Kết quả mong đợi**: 
  - Core features hoạt động
  - Minor UI differences acceptable
- **Mức độ ưu tiên**: Medium

#### TC_COMPAT_005: Edge desktop
- **Mục đích**: Kiểm tra trên Edge browser
- **Điều kiện tiên quyết**: Edge latest version
- **Các bước thực hiện**:
  1. Open app trên Edge
  2. Test scanner features
- **Kết quả mong đợi**: 
  - All features hoạt động (Edge dùng Chromium)
  - Similar to Chrome experience
- **Mức độ ưu tiên**: Low

---

### 7. Load Testing (5 test cases)

#### TC_LOAD_001: 10 concurrent users
- **Mục đích**: Baseline load test
- **Điều kiện tiên quyết**: 10 test accounts
- **Các bước thực hiện**:
  1. Simulate 10 users scanning simultaneously
  2. Monitor response times và errors
- **Kết quả mong đợi**: 
  - All requests succeed
  - Average response time < 5s
  - No errors
- **Mức độ ưu tiên**: Medium

#### TC_LOAD_002: 50 concurrent users
- **Mục đích**: Medium load test
- **Điều kiện tiên quyết**: 50 test accounts
- **Các bước thực hiện**:
  1. Simulate 50 concurrent scans
  2. Monitor system performance
- **Kết quả mong đợi**: 
  - Success rate >= 95%
  - Average response time < 10s
  - Acceptable degradation
- **Mức độ ưu tiên**: Medium

#### TC_LOAD_003: 100 concurrent users
- **Mục đích**: High load test
- **Điều kiện tiên quyết**: Load testing tool, 100 virtual users
- **Các bước thực hiện**:
  1. Ramp up to 100 concurrent users
  2. Sustain load for 5 minutes
- **Kết quả mong đợi**: 
  - System stable
  - Success rate >= 90%
  - May need rate limiting
- **Mức độ ưu tiên**: Low

#### TC_LOAD_004: Spike test
- **Mục đích**: Kiểm tra xử lý traffic spike
- **Điều kiện tiên quyết**: Load testing tool
- **Các bước thực hiện**:
  1. 10 users → 100 users trong 10s
  2. Sustain 30s
  3. Back to 10 users
- **Kết quả mong đợi**: 
  - System không crash
  - Recovery sau spike
  - Some requests có thể fail during spike
- **Mức độ ưu tiên**: Low

#### TC_LOAD_005: Endurance test
- **Mục đích**: Kiểm tra memory leaks và stability
- **Điều kiện tiên quyết**: 
  - 20 concurrent users
  - Run for 2-4 hours
- **Các bước thực hiện**:
  1. Simulate 20 users continuous scanning
  2. Monitor for 2-4 hours
- **Kết quả mong đợi**: 
  - System stable throughout
  - No memory leaks
  - Consistent performance
- **Mức độ ưu tiên**: Low

---

## SECURITY TESTING

### 8. Authentication & Authorization (5 test cases)

#### TC_SEC_001: Scan khi chưa đăng nhập
- **Mục đích**: Xác minh authentication required
- **Điều kiện tiên quyết**: User chưa đăng nhập
- **Các bước thực hiện**:
  1. Truy cập scanner page
  2. Attempt to scan
- **Kết quả mong đợi**: 
  - Redirect to login page
  - Hoặc show authentication required message
  - Cannot perform scan
- **Mức độ ưu tiên**: Critical

#### TC_SEC_002: Session timeout
- **Mục đích**: Kiểm tra session expiry
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Login
  2. Wait for session timeout (default 1 hour)
  3. Attempt to scan
- **Kết quả mong đợi**: 
  - Session expires
  - Require re-authentication
  - Data không bị mất
- **Mức độ ưu tiên**: High

#### TC_SEC_003: JWT token validation
- **Mục đích**: Kiểm tra token security
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Inspect JWT token
  2. Attempt to modify token
  3. Use modified token for scan
- **Kết quả mong đợi**: 
  - Modified token rejected
  - 401 Unauthorized error
  - No data access
- **Mức độ ưu tiên**: Critical

#### TC_SEC_004: RLS policy bypass attempt
- **Mục đích**: Kiểm tra RLS enforcement
- **Điều kiện tiên quyết**: 
  - User A logged in
  - User B has scan data
- **Các bước thực hiện**:
  1. User A attempts to query User B's scans
  2. Use direct database query
- **Kết quả mong đợi**: 
  - Query returns empty or error
  - RLS policy blocks access
  - No data leak
- **Mức độ ưu tiên**: Critical

#### TC_SEC_005: CSRF protection
- **Mục đích**: Xác minh CSRF protection
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Các bước thực hiện**:
  1. Craft malicious form from external site
  2. Submit form to scanner endpoint
- **Kết quả mong đợi**: 
  - Request rejected
  - CSRF token required
  - No action performed
- **Mức độ ưu tiên**: High

---

### 9. Input Validation & Data Security (5 test cases)

#### TC_SEC_006: SQL Injection trong plate number
- **Mục đích**: Kiểm tra SQL injection protection
- **Điều kiện tiên quyết**: Manual plate input enabled
- **Các bước thực hiện**:
  1. Input: `'; DROP TABLE license_plate_scans; --`
  2. Submit
- **Kết quả mong đợi**: 
  - Input được sanitize
  - Query parameterized
  - No SQL injection
- **Mức độ ưu tiên**: Critical

#### TC_SEC_007: XSS trong plate number display
- **Mục đích**: Kiểm tra XSS protection
- **Điều kiện tiên quyết**: Có scan result
- **Các bước thực hiện**:
  1. Attempt scan với plate: `<script>alert('XSS')</script>`
  2. View result display
- **Kết quả mong đợi**: 
  - Script không execute
  - Output được escape
  - No XSS vulnerability
- **Mức độ ưu tiên**: Critical

#### TC_SEC_008: Path traversal trong image upload
- **Mục đích**: Kiểm tra file upload security
- **Điều kiện tiên quyết**: Upload feature enabled
- **Các bước thực hiện**:
  1. Attempt upload với filename: `../../etc/passwd`
  2. Check file storage location
- **Kết quả mong đợi**: 
  - Filename sanitized
  - File stored in designated bucket only
  - No path traversal
- **Mức độ ưu tiên**: High

#### TC_SEC_009: Malicious file upload (executable)
- **Mục đích**: Kiểm tra file type validation
- **Điều kiện tiên quyết**: Upload feature enabled
- **Các bước thực hiện**:
  1. Rename .exe file to .jpg
  2. Attempt upload
- **Kết quả mong đợi**: 
  - File rejected
  - MIME type validated (not just extension)
  - Error message shown
- **Mức độ ưu tiên**: Critical

#### TC_SEC_010: Edge function authentication
- **Mục đích**: Xác minh edge function security
- **Điều kiện tiên quyết**: Có edge function recognize-license-plate
- **Các bước thực hiện**:
  1. Call edge function without auth token
  2. Call with invalid token
  3. Call with valid token
- **Kết quả mong đợi**: 
  - Calls without valid auth rejected
  - 401 errors for invalid auth
  - Success only with valid token
- **Mức độ ưu tiên**: Critical

---

## USABILITY TESTING

### 10. User Experience (5 test cases)

#### TC_UX_001: First-time user flow
- **Mục đích**: Đánh giá trải nghiệm người dùng mới
- **Điều kiện tiên quyết**: User chưa bao giờ dùng app
- **Các bước thực hiện**:
  1. Quan sát user complete first scan
  2. Note confusions hoặc hesitations
- **Kết quả mong đợi**: 
  - User hoàn thành scan trong < 2 phút
  - Không cần instructions
  - UI intuitive
- **Mức độ ưu tiên**: High

#### TC_UX_002: Error message clarity
- **Mục đích**: Đánh giá quality của error messages
- **Điều kiện tiên quyết**: Trigger various errors
- **Các bước thực hiện**:
  1. Trigger camera error
  2. Trigger upload error
  3. Trigger recognition error
- **Kết quả mong đợi**: 
  - Error messages rõ ràng, dễ hiểu
  - Có actionable solutions
  - Không technical jargon
- **Mức độ ưu tiên**: High

#### TC_UX_003: Loading states và feedback
- **Mục đích**: Kiểm tra user feedback during operations
- **Điều kiện tiên quyết**: Perform scan operations
- **Các bước thực hiện**:
  1. Start scan
  2. Observe loading indicators
  3. Check progress feedback
- **Kết quả mong đợi**: 
  - Loading spinner visible
  - Progress percentage shown (if applicable)
  - User không wondering "đã submit chưa?"
- **Mức độ ưu tiên**: Medium

#### TC_UX_004: Mobile responsiveness
- **Mục đích**: Đánh giá mobile UX
- **Điều kiện tiên quyết**: Test trên mobile device
- **Các bước thực hiện**:
  1. Test all features trên mobile
  2. Check touch targets
  3. Check layouts
- **Kết quả mong đợi**: 
  - All buttons dễ tap (>44px)
  - Layout không bị vỡ
  - Keyboard không che UI
- **Mức độ ưu tiên**: High

#### TC_UX_005: Accessibility (a11y)
- **Mục đích**: Kiểm tra accessibility compliance
- **Điều kiện tiên quyết**: Screen reader enabled
- **Các bước thực hiện**:
  1. Navigate using keyboard only
  2. Use screen reader
  3. Check color contrast
- **Kết quả mong đợi**: 
  - All elements keyboard accessible
  - Screen reader announces properly
  - WCAG 2.1 AA compliance
- **Mức độ ưu tiên**: Medium

---

## Test Data

### Valid License Plates
```
51F-238.91
43A-12345
51F23891
29B-567.89
30G-999.99
```

### Invalid License Plates
```
ABC-123 (wrong format)
51F (incomplete)
51F-238.91.00 (too many dots)
<script>alert('xss')</script> (malicious)
'; DROP TABLE vehicles; -- (sql injection)
```

### Test Images
- `high_quality_51F.jpg` - 1080p, good lighting, straight angle
- `low_quality_blur.jpg` - 480p, blurry, poor quality
- `angled_43A.jpg` - 720p, 45° angle
- `dark_29B.jpg` - Low light conditions
- `dirty_30G.jpg` - Plate covered with mud
- `no_plate.jpg` - Random image without plate

---

## Test Environment

- **Browser**: Chrome 120+, Safari 15+, Firefox latest
- **Mobile**: iOS 15+, Android 10+
- **Backend**: Supabase (Lovable Cloud)
- **Network**: 4G/WiFi, simulate 3G for performance tests
- **Test Accounts**: 5 standard users, 1 admin
- **Test Database**: Separate from production

---

## Acceptance Criteria

### Critical Functions (Must Pass 100%)
- Authentication & Authorization
- License Plate Recognition (accuracy >= 85%)
- Database RLS Policies
- Input Validation & Security

### High Priority (Must Pass >= 95%)
- Camera Access & Control
- Image Upload
- Performance (response time)

### Medium Priority (Must Pass >= 90%)
- Compatibility across browsers
- Load testing
- Usability

### Low Priority (Must Pass >= 80%)
- Advanced features
- Edge cases
- Minor UI issues

---

## Test Execution Schedule

1. **Week 1**: Functional Testing (TC_CAM, TC_IMG)
2. **Week 2**: Functional Testing (TC_REC, TC_DB)
3. **Week 3**: Security Testing (TC_SEC)
4. **Week 4**: Non-Functional Testing (TC_PERF, TC_COMPAT, TC_LOAD)
5. **Week 5**: Usability Testing (TC_UX) + Regression
6. **Week 6**: Bug fixes và Re-testing

---

## Notes

- Tất cả test cases nên được automated nếu có thể (especially regression tests)
- Security tests nên được run thường xuyên (CI/CD pipeline)
- Performance baseline nên được establish và monitor theo thời gian
- Test data nên được refresh định kỳ
- Mobile testing đặc biệt quan trọng vì đây là camera-based app

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Next Review Date**: 2025-12-10
