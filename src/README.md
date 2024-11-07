# Dự án

# Cấu trúc Thư mục

- [src](#src)
  - [components](#components)
    - [forms](#forms)
      - [entryForm.js](#entryformjs)
      - [formUtils.js](#formutilsjs)
      - [goto.js](#gotojs)
      - [setForm.js](#setformjs)
    - [menus](#menus)
      - [datepicker.js](#datepickerjs)
      - [editCategory.js](#editcategoryjs)
      - [entryOptions.js](#entryoptionsjs)
      - [header.js](#headerjs)
      - [shortcutsModal.js](#shortcutsmodaljs)
      - [sidebarCategories.js](#sidebarcategoriesjs)
      - [sidebarDatepicker.js](#sidebardatepickerjs)
      - [sidebarFooter.js](#sidebarfooterjs)
      - [sidebarSubMenu.js](#sidebarsubmenujs)
    - [toastPopups](#toastpopups)
      - [toast.js](#toastjs)
    - [views](#views)
      - [dayview.js](#dayviewjs)
      - [listview.js](#listviewjs)
      - [monthview.js](#monthviewjs)
      - [weekview.js](#weekviewjs)
      - [yearview.js](#yearviewjs)
  - [config](#config)
    - [appDefaults.js](#appdefaultsjs)
    - [renderViews.js](#renderviewsjs)
    - [setViews.js](#setviewsjs)
  - [context](#context)
    - [appContext.js](#appcontextjs)
    - [constants.js](#constantsjs)
    - [store.js](#storejs)
  - [factory](#factory)
    - [entries.js](#entriesjs)
    - [queries.js](#queriesjs)
  - [locales](#locales)
    - [en.js](#enjs)
    - [kbDefault.js](#kbdefaultjs)
  - [utilities](#utilities)
    - [dateutils.js](#dateutilsjs)
    - [dragutils.js](#dragutilsjs)
    - [helpers.js](#helpersjs)
    - [svgs.js](#svgsjs)
    - [testing.js](#testingjs)
    - [timeutils.js](#timeutilsjs)
- [webpack.config.js](#webpackconfigjs)

# entryForm.js

`entryForm.js` là một tập tin JavaScript quản lý và xử lý các hoạt động liên quan đến biểu mẫu nhập liệu trong ứng dụng. Dưới đây là các chức năng chính của các hàm trong tập tin này:

## 1. Quản lý Trình Chọn Thời Gian (Timepicker)

- **`closetimepicker()`**: Đóng và xóa các phần tử của trình chọn thời gian. Loại bỏ lớp `active-form-time` khỏi phần tử đang hoạt động.

- **`createTimepicker(coords, currentTime, end, endLimit)`**: Tạo và hiển thị trình chọn thời gian tại tọa độ chỉ định. Xử lý giờ và phút dựa trên giờ hiện tại, có thể đặt giờ kết thúc và hạn chế giờ kết thúc.

- **`handleTimepickerSetup(target)`**: Cấu hình vị trí cho trình chọn thời gian dựa trên vị trí của phần tử mục tiêu.

## 2. Xử Lý Ngày và Giờ

- **`setEndDateToNextDay()`**: Thiết lập ngày kết thúc là ngày hôm sau so với ngày bắt đầu hiện tại. Đặt giờ kết thúc là 12:30am.

- **`setEndDateToNextHour()`**: Thiết lập giờ kết thúc là giờ kế tiếp sau giờ bắt đầu hiện tại. Cập nhật ngày kết thúc nếu giờ bắt đầu là 23:45.

- **`getDatePicker(year, month, day)`**: Hiển thị trình chọn ngày với lớp phủ. Thiết lập ngày được chọn và các thuộc tính liên quan.

- **`getDateTimeFormatted(dateAttr, timeAttr)`**: Kết hợp ngày và thời gian thành một đối tượng `Date` đầy đủ với giờ, phút và giây được thiết lập.

## 3. Xử Lý Biểu Mẫu

- **`checkFormValidity(title, description, category, startDate, endDate)`**: Kiểm tra tính hợp lệ của các trường đầu vào trong biểu mẫu và trả về thông báo lỗi nếu có lỗi.

- **`handleFormErrors(errorMessages)`**: Xử lý và hiển thị các lỗi của biểu mẫu bằng cách thêm thông báo lỗi vào các trường đầu vào và thay đổi trạng thái của nút gửi.

- **`handleFormSubmission(e)`**: Xử lý việc gửi biểu mẫu, kiểm tra tính hợp lệ của các trường đầu vào và thực hiện thao tác tạo hoặc chỉnh sửa dựa trên loại gửi.

- **`handleFormClose(e)`**: Đóng biểu mẫu và làm sạch giao diện người dùng, bao gồm xóa lỗi và đóng các phần tử giao diện khác.

## 4. Xử Lý Danh Mục

- **`handleCategorySelection(e)`**: Xử lý việc chọn danh mục và cập nhật giao diện với tiêu đề và màu sắc của danh mục đó. Đóng modal danh mục.

- **`createCategoryOptions(parent, categories)`**: Tạo các tùy chọn danh mục và thêm chúng vào modal danh mục, hiển thị danh mục hiện tại với biểu tượng kiểm tra nếu cần.

- **`openCategoryModal(e, categories)`**: Mở modal danh mục với các tùy chọn danh mục, điều chỉnh chiều cao và vị trí của modal dựa trên số lượng danh mục.

- **`closeCategoryModal()`**: Đóng modal danh mục bằng cách ẩn các phần tử liên quan và làm sạch nội dung của modal.

## 5. Xử Lý Lỗi và Cập Nhật Giao Diện

- **`removeErrorMessages(e)`**: Xóa bỏ các thông báo lỗi và loại bỏ các lớp CSS lỗi từ các trường đầu vào khi người dùng tương tác.

- **`removeLastFormEntry()`**: Xóa bỏ mục cuối cùng trong danh sách lưu trữ và cập nhật giao diện người dùng.

- **`undoLastFormEdit(id, entryBefore)`**: Hoàn tác chỉnh sửa cuối cùng của mục và khôi phục nó về trạng thái trước đó.

- **`clearAllErrors()`**: Xóa tất cả các thông báo lỗi từ các trường đầu vào và đặt lại trạng thái của chúng.

## 6. Các Chức Năng Khác

- **`dragFormAnywhere(e)`**: Cho phép kéo di chuyển biểu mẫu đến bất kỳ vị trí nào trong cửa sổ trình duyệt, đồng thời giới hạn di chuyển để không vượt quá kích thước cửa sổ.

- **`setFormInitialValues()`**: Thiết lập các giá trị ban đầu cho biểu mẫu bao gồm tiêu đề, mô tả, danh mục, ngày, giờ, và các nút của biểu mẫu. Đăng ký các sự kiện cần thiết cho các phần tử của biểu mẫu.

- **`getDefaultCategory()`**: Lấy danh mục mặc định để thiết lập khi không có danh mục hoạt động nào.

- **`setInitialFormCategory()`**: Thiết lập danh mục ban đầu cho biểu mẫu dựa trên danh mục mặc định.



# formUtils.js
## FormConfig

Lớp `FormConfig` chịu trách nhiệm cấu hình và quản lý giao diện người dùng của một biểu mẫu trong ứng dụng. Nó xử lý các khía cạnh khác nhau của việc thiết lập biểu mẫu, bao gồm định vị, phong cách và nhập dữ liệu.

### Các Phương Thức
- **`setFormStyle(eX, eY, shouldCenter = false, centerOffset = null)`**: Định vị biểu mẫu trên trang với tùy chọn căn giữa và bù đắp.
- **`setFormSubmitType(type, id)`**: Cấu hình nút gửi với loại hành động và ID.
- **`configFormTitleDescriptionInput(title, description)`**: Cập nhật trường tiêu đề và mô tả của biểu mẫu.
- **`setFormDateInput(input, date, minutes, dateFormatted)`**: Cài đặt ngày và giờ cho các trường nhập liệu của biểu mẫu và định dạng chúng để hiển thị.
- **`setFormDatepickerDate(context, datepickerContext, start)`**: Cấu hình trình chọn ngày với ngày đã chọn.
- **`configFormDateInputs(dates)`**: Cập nhật các trường nhập ngày và giờ cho ngày bắt đầu và kết thúc.
- **`configFormCategoryInput(categoryData)`**: Thiết lập thông tin danh mục cho biểu mẫu, bao gồm tiêu đề và màu sắc.
- **`getConfig(data)`**: Cấu hình biểu mẫu dựa trên dữ liệu được cung cấp, bao gồm loại gửi, danh mục, ngày và tùy chọn tiêu đề và mô tả.

## createGoTo.js

`createGoTo.js` quản lý các chức năng liên quan đến việc mở và xử lý biểu mẫu "Đi đến ngày" trong giao diện người dùng, cho phép người dùng chọn một ngày cụ thể.

### Các Thành Phần Chính

- **`locales`**: Nhập các nhãn tháng từ tệp `locales/en` để hỗ trợ định dạng ngày.
- **`setViews`**: Nhập hàm cấu hình giao diện từ tệp `setViews` để cập nhật giao diện sau khi chọn ngày.
- **`setSidebarDatepicker`**: Nhập hàm từ tệp `sidebarDatepicker` để cập nhật trình chọn ngày trong sidebar khi cần.
- **`monthsArray`** và **`monthsArrayLong`**: Mảng chứa các tên tháng ngắn và dài để chuyển đổi giữa các định dạng ngày tháng.
- **`gotoOverlay`, `goto`, `gotoInput`, `inputErrMessage`, `cancelGoto`, `submitGoto`**: Các phần tử DOM liên quan đến biểu mẫu "Đi đến ngày" và thông báo lỗi.

### Các Chức Năng Chính

- **`validateDate(date)`**: Xác thực và phân tích ngày được nhập theo hai định dạng: "DD/MM/YYYY" hoặc "jan 1 2021". Trả về đối tượng `Date` nếu hợp lệ, ngược lại trả về `false`.
- **`removeError()`** và **`handleError()`**: Xử lý hiển thị và ẩn thông báo lỗi khi người dùng nhập ngày không hợp lệ.
- **`handleGoTo()`**: Xử lý sự kiện khi người dùng nhấn nút "Đi đến". Xác thực ngày, cập nhật ngày trong giao diện và đóng biểu mẫu nếu ngày hợp lệ.
- **`closeGoToOnEscape(e)`**: Đóng biểu mẫu hoặc xử lý sự kiện khi người dùng nhấn phím "Escape" hoặc "Enter".
- **`closeGoTo()`**: Đóng biểu mẫu, xóa sự kiện và các lớp CSS liên quan, và làm sạch giá trị nhập.
- **`formatStart()`**: Định dạng ngày hiện tại trong giao diện thành chuỗi ngày tháng theo định dạng "Month Day Year".
- **`openGoTo()`**: Mở biểu mẫu "Đi đến ngày", thiết lập giá trị nhập theo ngày hiện tại, và thêm các sự kiện cần thiết cho việc đóng biểu mẫu và xử lý ngày.

## setForm.js

Lớp `FormSetup` được sử dụng để quản lý và cấu hình dữ liệu biểu mẫu, bao gồm chi tiết gửi, thông tin danh mục và thiết lập ngày.

### Các Thuộc Tính
- **`submission`**: Lưu trữ chi tiết gửi bao gồm loại, ID, tiêu đề và mô tả.
- **`category`**: Chứa thông tin về danh mục, chẳng hạn như tên và màu sắc.
- **`dates`**: Lưu trữ thông tin ngày, bao gồm ngày bắt đầu và kết thúc và các phút liên quan.

### Các Phương Thức

- **`setSubmission(type, id, title, description)`**
  - Cấu hình chi tiết gửi.
  - **Tham số**:
    - `type` (string): Loại hành động (`"edit"` hoặc `"create"`).
    - `id` (string|null): ID mục nhập hoặc `null`.
    - `title` (string|null): Tiêu đề hoặc `null`.
    - `description` (string|null): Mô tả hoặc `null`.

- **`setCategory(name, color)`**
  - Thiết lập thông tin danh mục.
  - **Tham số**:
    - `name` (string): Tên danh mục.
    - `color` (string): Màu sắc danh mục.

- **`setDates(object)`**
  - Cấu hình thiết lập ngày.
  - **Tham số**:
    - `object` (object): Chứa chi tiết ngày:
      - `Dates`: Mảng của `[new Date(start), new Date(end)]`.
      - `Dates`: Mảng của `[start("YYYY-MM-DD"), end("YYYY-MM-DD")]`.
      - `Minutes`: Mảng của `[number, number]`.

- **`getSetup()`**
  - Trả về cấu hình hiện tại của `submission`, `category`, và `dates`.

### Cách Sử Dụng
Khởi tạo lớp `FormSetup` và sử dụng các phương thức của nó để cấu hình dữ liệu biểu mẫu, sau đó lấy cấu hình bằng cách sử dụng `getSetup()`.

## datepicker.js

Hàm `setDatepicker` khởi tạo và quản lý UI của trình chọn ngày, bao gồm xử lý tương tác của người dùng và hiển thị ngày.

### Các Tham Số
- **`context`**: Đối tượng chứa các phương thức để tương tác với trình chọn ngày (ví dụ: cài đặt ngày).
- **`store`**: Đối tượng để lấy và quản lý dữ liệu liên quan đến ngày.
- **`datepickerContext`**: Đối tượng cung cấp các phương thức và ngữ cảnh liên quan đến ngày cho trình chọn ngày.
- **`type`**: Chuỗi chỉ định ngữ cảnh ("form" hoặc ngữ cảnh khác), xác định cách xử lý ngày.

### Chức Năng

1. **Khởi Tạo Datepicker**:
   - Thiết lập tiêu đề trình chọn ngày.
   - Tạo và hiển thị các ô ngày cho tháng hiện tại.
   - Đăng ký các trình xử lý sự kiện cho tương tác của người dùng.

2. **Hiển Thị Ngày**:
   - Cập nhật UI của trình chọn ngày để phản ánh các ngày và tháng/năm đã chọn.
   - Nổi bật các ngày đã chọn và xử lý các điều kiện cho ngày bắt đầu và kết thúc.

3. **Xử Lý Sự Kiện**:
   - Quản lý việc điều hướng giữa các tháng và năm.
   - Xử lý việc chọn ngày và thay đổi.
   - Phản hồi các sự kiện bàn phím cho việc điều hướng và chọn ngày.

4. **Quản Lý Modal**:
   - Mở và đóng modal thay đổi ngày cho việc điều chỉnh tháng và năm.
   - Cập nhật UI dựa trên đầu vào của người dùng trong modal.

5. **Tiện Ích**:
   - Các hàm để hiển thị các tháng tiếp theo/trước đó, xử lý việc chọn ngày, và quản lý các thay đổi ngày.

### Cách Sử Dụng

Gọi `setDatepicker` với các tham số thích hợp để khởi tạo và quản lý chức năng của trình chọn ngày trong ứng dụng của bạn. Hàm này nên được gọi để thiết lập trình chọn ngày và gắn các trình xử lý sự kiện cần thiết.

## editCategory.js

Hàm `createCategoryForm` khởi tạo và quản lý giao diện biểu mẫu danh mục, bao gồm việc xử lý các tương tác của người dùng để tạo hoặc chỉnh sửa danh mục.

### Các Tham Số
- **`store`**: Đối tượng để quản lý dữ liệu danh mục và các tương tác.
- **`selectedCategory`**: Đối tượng đại diện cho danh mục hiện tại, với các thuộc tính `name` và `color`.
- **`editing`**: Boolean chỉ định liệu biểu mẫu có được sử dụng để chỉnh sửa một danh mục hiện có hay không.
- **`resetParent`**: Phần tử DOM tùy chọn để định vị biểu mẫu tương đối.

### Chức Năng

1. **Khởi Tạo Biểu Mẫu**:
   - Thiết lập biểu mẫu danh mục với chi tiết danh mục hiện tại.
   - Cấu hình trình chọn màu với các màu có sẵn.

2. **Xử Lý Chọn Màu**:
   - Cập nhật lựa chọn màu trong giao diện người dùng.
   - Xử lý sự thay đổi màu để phù hợp với lựa chọn của người dùng.

3. **Xử Lý Tương Tác Người Dùng**:
   - Quản lý việc gửi biểu mẫu và xác nhận thông tin.
   - Cập nhật hoặc lưu trữ danh mục dựa trên trạng thái `editing`.

4. **Quản Lý Modal**:
   - Hiển thị và ẩn modal để tạo hoặc chỉnh sửa danh mục.
   - Xử lý các sự kiện bàn phím và nhấp chuột để tương tác với modal.

5. **Tiện Ích**:
   - Các hàm để hiển thị và làm sạch biểu mẫu.
   - Các hàm để quản lý các tương tác của người dùng và cập nhật trạng thái ứng dụng.

### Cách Sử Dụng

Gọi `createCategoryForm` với các tham số thích hợp để khởi tạo và quản lý giao diện biểu mẫu danh mục. Đảm bảo rằng tất cả các tương tác của người dùng và thay đổi danh mục được xử lý chính xác.

# entryOptions.js
Hàm `getEntryOptionModal` quản lý các tùy chọn và hành động của một mục trong ứng dụng, bao gồm việc mở các biểu mẫu chỉnh sửa, xóa mục và xử lý tương tác của người dùng.

### Các Thành Phần Chính
- **`entryOptionsOverlay`**: Phần tử DOM cho lớp phủ tùy chọn mục.
- **`entryOptionsWrapper`**: Phần tử DOM cho khung chứa các tùy chọn mục.
- **`entryOptionsHeaderWrapper`**: Phần tử DOM cho tiêu đề của tùy chọn mục.
- **`entryOptionsDateHeader`**: Phần tử DOM cho tiêu đề ngày.
- **`entryOptionsTimeHeader`**: Phần tử DOM cho tiêu đề thời gian.
- **`entryOptionTitle`**: Phần tử DOM cho tiêu đề mục.
- **`entryOptionDescription`**: Phần tử DOM cho mô tả mục.
- **`entryOptionCategoryIcon`**: Phần tử DOM cho biểu tượng danh mục.
- **`entryOptionCategory`**: Phần tử DOM cho tên danh mục.

### Các Chức Năng Chính

- **`openEditForm()`**: Mở biểu mẫu chỉnh sửa và hoàn tất thiết lập, sau đó đóng tùy chọn mục.
- **`proceedDelete(entry)`**: Xóa mục và cập nhật giao diện.
- **`openDeleteWarning()`**: Hiển thị cảnh báo xóa với tùy chọn xác nhận hoặc hủy bỏ.
- **`formNegated()`**: Đặt lại biểu mẫu và modal về trạng thái mặc định nếu không mở biểu mẫu từ modal.
- **`closeEntryOptions()`**: Đóng tùy chọn mục, làm sạch các phần tử và xóa sự kiện.
- **`setEntryDefaults()`**: Cấu hình mặc định cho tùy chọn mục, bao gồm ngày, thời gian, tiêu đề, mô tả, và danh mục.
- **`handleEntryOptionKD(e)`**: Xử lý các sự kiện bàn phím cho các tùy chọn mục.
- **`delegateEntryOptions(e)`**: Xử lý các tương tác của người dùng với các nút chỉnh sửa, xóa, và đóng.
# header.js
Hàm `setHeader` cấu hình tiêu đề và các thuộc tính của các phần tử giao diện người dùng dựa trên loại thành phần hiện tại (day, week, month, year, list).

### Các Thành Phần Chính
- **`btntoday`**: Phần tử DOM cho nút "Hôm nay".
- **`dateTimeTitle`**: Phần tử DOM cho tiêu đề ngày giờ.
- **`header`**: Phần tử DOM cho tiêu đề chính.
- **`selectElement`**: Phần tử DOM cho phần tử chọn.
- **`btnprev`**: Phần tử DOM cho nút "Trước".
- **`btnnext`**: Phần tử DOM cho nút "Tiếp theo".
- **`datetimeWrapper`**: Phần tử DOM cho khung chứa ngày giờ.
- **`datetimeContent`**: Phần tử DOM cho nội dung ngày giờ.
- **`prevnext`**: Phần tử DOM cho các nút trước và tiếp theo.

### Các Chức Năng Chính

- **`configHeader(borderstyle, componentTitle)`**: Cấu hình tiêu đề bằng cách thiết lập kiểu viền, tiêu đề thành phần, và các thuộc tính khác của các phần tử liên quan.
- **`setHeaderAttributes(view)`**: Thiết lập các thuộc tính cho tiêu đề dựa trên loại xem hiện tại (day, week, month, year, list).

### Cách Sử Dụng
Gọi hàm `setHeader` với các tham số:
- **`context`**: Đối tượng chứa thông tin ngày, tuần, tháng, và năm.
- **`component`**: Loại thành phần hiện tại (day, week, month, year, list).
- **`store`**: Đối tượng lưu trữ trạng thái ứng dụng.

Hàm sẽ cấu hình tiêu đề và các thuộc tính của các phần tử giao diện người dùng tương ứng với loại thành phần được chỉ định.
# shortcutsModal.js
Hàm `handleShortCutsModal` quản lý việc hiển thị và tương tác với modal hướng dẫn phím tắt.

### Các Thành Phần Chính
- **`shortcutsModalOverlay`**: Phần tử DOM cho lớp phủ của modal hướng dẫn.
- **`shortcutsModal`**: Phần tử DOM cho modal hướng dẫn.
- **`shortcutsModalContent`**: Phần tử DOM cho nội dung của modal.
- **`shortcutsModalClose`**: Phần tử DOM cho nút đóng modal.
- **`notifyShortcutsStatus`**: Phần tử DOM cho thông báo trạng thái phím tắt.

### Các Chức Năng Chính

- **`createShortcut(key, description)`**: Tạo một phần tử DOM đại diện cho một phím tắt với mô tả của nó. Có thể hiển thị một hoặc hai phím và mô tả phím tắt.

- **`handleShortcutsModalClose()`**: Đóng modal và xóa nội dung của nó, đồng thời loại bỏ lớp phủ và sự kiện keydown để đóng modal.

- **`closeShortcutsOnKeydown(e)`**: Đóng modal nếu người dùng nhấn phím "Escape", "/" hoặc "?".

- **`setStatusIcon(status)`**: Cập nhật biểu tượng trạng thái phím tắt dựa trên việc kích hoạt hoặc vô hiệu hóa phím tắt.

- **`handleShortcutsModalOpen()`**: Mở modal và hiển thị danh sách các phím tắt hiện tại. Thiết lập trạng thái phím tắt và thêm các sự kiện cần thiết cho các nút trong modal.

  - **`toggleShortcutsStatus()`**: Chuyển đổi trạng thái của phím tắt và cập nhật giao diện.

### Cách Sử Dụng
Gọi hàm `handleShortCutsModal` với tham số:
- **`store`**: Đối tượng lưu trữ trạng thái ứng dụng để lấy và thiết lập trạng thái phím tắt cũng như danh sách các phím tắt.

Hàm sẽ quản lý việc mở và đóng modal, hiển thị các phím tắt và cập nhật trạng thái của chúng.
# sidebarCategories.js

Hàm `handleSidebarCategories` quản lý các hoạt động liên quan đến danh mục trong sidebar, bao gồm hiển thị, chỉnh sửa, xóa và tùy chọn khác cho danh mục.

### Các Thành Phần Chính
- **`sidebarColTwo`**: Phần tử DOM cho khu vực danh mục trong sidebar.
- **`cWrapper`**: Phần tử DOM cho lớp chứa các danh mục.
- **`categoriesContainer`**: Phần tử DOM chứa các danh mục.
- **`categoriesHeader`**: Phần tử DOM cho tiêu đề của danh mục.
- **`categoryHeaderCaret`**: Phần tử DOM cho mũi tên của tiêu đề danh mục.

### Các Chức Năng Chính

- **`updateComponent()`**: Cập nhật giao diện của các thành phần bằng cách gọi `setViews`.

- **`renderSidebarDatepickerCtg()`**: Cập nhật ngày trong sidebar.

- **`renderCategories()`**: Hiển thị tất cả các danh mục từ cửa hàng.

- **`createCategoryListItem(ctgname, ctgcolor, status)`**: Tạo một phần tử DOM cho một danh mục với tên, màu và trạng thái đã chọn.

- **`handleCategoryModalToggle()`**: Chuyển đổi hiển thị của modal danh mục và cập nhật màu nền của tiêu đề.

- **`createDeleteCategoryPopup(e)`**: Tạo và hiển thị popup xóa danh mục với các tùy chọn di chuyển hoặc xóa danh mục và các mục của nó.

- **`handleCategorySelection(e)`**: Xử lý việc chọn hoặc bỏ chọn danh mục khi người dùng nhấp vào ô kiểm.

- **`openCategoryOptionsMenu(e, data)`**: Mở menu tùy chọn cho danh mục với các tùy chọn như chỉnh sửa, chỉ hiển thị mục này, hoặc hiển thị tất cả các mục ngoại trừ mục này.

- **`delegateCategoryEvents(e)`**: Phân loại sự kiện click vào các phần tử trong danh mục để xử lý các hành động khác nhau như mở modal, chỉnh sửa danh mục, xóa danh mục, hoặc tạo danh mục mới.

### Cách Sử Dụng

Gọi hàm `handleSidebarCategories` với các tham số:
- **`context`**: Ngữ cảnh của ứng dụng để cập nhật giao diện.
- **`store`**: Đối tượng lưu trữ trạng thái của danh mục.
- **`datepickerContext`**: Ngữ cảnh của datepicker.

Hàm này sẽ khởi tạo và quản lý các sự kiện liên quan đến danh mục, bao gồm hiển thị danh mục, mở các popup, và xử lý các tương tác của người dùng.
# sidebarDatepicker.js
Đoạn mã này cấu hình và xử lý các chức năng của một datepicker trong sidebar. Dưới đây là các chức năng chính:

1. **Khởi tạo các biến DOM**:
   - `sbdatepicker`, `sbdatepickerBody`, `sbdatepickerTitle`, `sbdatepickerChangeDate`, `sbyearpickerTitle`, `sbmonthpickerMonths` được sử dụng để truy cập và thao tác với các phần tử giao diện người dùng.

2. **Hàm `setSidebarDatepicker`**:
   - **Khởi tạo ngày tháng**: Đặt ngày, tháng, năm cho datepicker dựa trên đối tượng `datepickerContext`.
   - **Tạo và cập nhật giao diện datepicker**:
     - `setDatepickerHeader()`: Cập nhật tiêu đề của datepicker với tháng và năm hiện tại.
     - `createCells(montharray)`: Tạo các ô ngày trong datepicker.
     - `resetpickerData()`: Đặt lại dữ liệu liên quan đến ngày và tuần.
   - **Xử lý các thao tác của người dùng**:
     - `setNewDate(e)`: Cập nhật ngày đã chọn và quyết định có cần làm mới datepicker hay không.
     - `renderSelectedDay(e, d)`: Cập nhật giao diện để hiển thị ngày đã chọn.
     - `renderprevMonth()`, `rendernextMonth()`: Chuyển đến tháng trước hoặc tháng sau.
   - **Quản lý các modal và phần chọn năm/tháng**:
     - `openChangeDateModal()`, `closeChangeDateModal()`: Mở và đóng modal chọn ngày.
     - `monthpickerSetMonth(val, init)`: Cập nhật tháng chọn.
     - `yearpickerSetYear(increment, init)`: Cập nhật năm chọn.
   - **Xử lý sự kiện người dùng**:
     - `delegateDatepickerEvents(e)`: Quản lý các sự kiện click trên datepicker, bao gồm chọn ngày, chuyển tháng/năm, mở/đóng modal.

3. **Khởi tạo datepicker**:
   - `initsbdatepicker()`: Đặt tiêu đề datepicker, tạo các ô ngày và thiết lập sự kiện click cho datepicker.

**Chú ý**:
- Datepicker trong sidebar sẽ không đóng khi chọn ngày; các chức năng đặc biệt được xử lý để giữ datepicker mở và cập nhật đúng trạng thái.

# sidebarFooter.js
Đoạn mã này quản lý các chức năng liên quan đến phần chân của sidebar (sidebar footer) và popup thông tin. Dưới đây là các chức năng chính:

1. **Khởi tạo các biến DOM**:
   - `sidebarFooter`, `sbInfoPopup`, `sbInfoPopupOverlay`, `selectInfo`, `closePopupButton`, `infopopupTitle`, `infopopupBody` được sử dụng để truy cập và thao tác với các phần tử giao diện người dùng.

2. **Hàm `handleSidebarFooter`**:
   - **Quản lý nội dung popup**:
     - `infoContent`: Chứa thông tin cho các loại popup khác nhau (ghi chú dự án, chính sách bảo mật, điều khoản sử dụng).
     - `setInfoContent(selection)`: Cập nhật tiêu đề và nội dung của popup dựa trên lựa chọn.
   - **Xử lý sự kiện của người dùng**:
     - `handleSelectInfoChange(e)`: Xử lý khi người dùng thay đổi lựa chọn trong popup.
     - `closeInfoPopupOnEscape(e)`: Đóng popup khi người dùng nhấn phím Escape.
     - `delegateSidebarFooterEvents(e)`: Xử lý sự kiện click trên chân sidebar để mở các loại popup thông tin tương ứng.
   - **Quản lý popup thông tin**:
     - `closeInfoPopup()`: Đóng popup và loại bỏ các sự kiện liên quan.
     - `setUpInfoPopup()`: Thiết lập các sự kiện và cập nhật nội dung của popup khi mở.
     - `openInfoPopup(selection)`: Mở popup với nội dung tương ứng dựa trên lựa chọn.

3. **Khởi tạo các sự kiện**:
   - `sidebarFooter.onmousedown = delegateSidebarFooterEvents`: Gán sự kiện click cho chân sidebar để xử lý các thao tác của người dùng.

**Chú ý**:
- Các popup chứa thông tin sẽ được mở khi người dùng click vào các phần tử tương ứng trong chân sidebar và sẽ đóng khi người dùng nhấn phím Escape hoặc click ra ngoài popup.

# sidebarSubMenu.js
Mã nguồn này quản lý các chức năng của menu phụ bên trong sidebar. Nó bao gồm các thao tác như mở, đóng menu phụ, thay đổi chủ đề, bật/tắt phím tắt, và xử lý tệp JSON.

### Các Biến DOM
- `sidebarSubMenuOverlay`: Phần lớp phủ của menu phụ.
- `sidebarSubMenu`: Menu phụ chính.
- `closeSubMenuBtn`: Nút đóng menu phụ.
- `appBody`: Thân của ứng dụng chính.
- `themeRadioBtns`: Các nút radio chọn chủ đề.
- `themeRadioOptions`: Các tùy chọn chủ đề.
- `shortcutSwitch`: Công tắc bật/tắt phím tắt.
- `animationsSwitchBtn`: Công tắc bật/tắt hoạt ảnh.
- `notifyDisabledShortcutsIcon`: Biểu tượng thông báo trạng thái phím tắt.

### Các Hàm Chính

- **`closeSubOnEscape(e)`**: Đóng menu phụ khi nhấn phím Escape hoặc 'a'.

- **`createUploadConfirmationPopup()`**: Tạo popup xác nhận khi tải lên tệp JSON. Bao gồm thông tin về số lượng mục và danh mục trong dữ liệu.

- **`closeSubMenu()`**: Đóng menu phụ và xóa popup xác nhận nếu có.

- **`setStatusIcon(status)`**: Cập nhật biểu tượng thông báo trạng thái của phím tắt.

- **`openSubMenu()`**: Mở menu phụ và thiết lập trạng thái cho các tùy chọn chủ đề và phím tắt.

- **`getJSONUpload(e)`**: Xử lý việc tải lên tệp JSON từ người dùng.

- **`getJSONDownload()`**: Tải xuống dữ liệu dưới dạng tệp JSON.

- **`removePopup()`**: Xóa popup xác nhận và lớp phủ của menu phụ.

- **`handleCalendarJSON(action)`**: Xử lý hành động tải lên hoặc tải xuống tệp JSON.

- **`handleThemeChange(e)`**: Thay đổi chủ đề của ứng dụng dựa trên lựa chọn của người dùng.

- **`openKbShortcutMenu()`**: Đóng menu phụ và mở modal phím tắt.

- **`toggleShortcuts()`**: Bật/tắt trạng thái phím tắt và cập nhật biểu tượng.

- **`toggleShortcutsIcon()`**: Chuyển đổi trạng thái của biểu tượng phím tắt.

- **`setAnimationsIcons(val)`**: Cập nhật biểu tượng trạng thái hoạt ảnh.

- **`toggleAnimations(fromicon)`**: Bật/tắt hoạt ảnh và cập nhật trạng thái của lớp ứng dụng.

- **`delegateSubMenuEvents(e)`**: Xử lý các sự kiện trong menu phụ, bao gồm các nút tải lên, tải xuống, thay đổi chủ đề, và chuyển đổi phím tắt.

- **`setSidebarSubMenu()`**: Thiết lập menu phụ và gán các sự kiện cho menu phụ.

### Sử Dụng
- Gọi `getSidebarSubMenu(store, context)` để khởi tạo và thiết lập menu phụ.

# toast.js
Mã nguồn này quản lý việc hiển thị một thông báo "toast" với các tính năng đóng và hoàn tác.

### Các Biến DOM
- `body`: Thân của ứng dụng chính.
- `toast`: Phần tử thông báo toast.

### Các Hàm Chính

- **`closetoast()`**: Đóng thông báo toast bằng cách xóa lớp hiển thị và xóa nội dung của toast. Đồng thời gỡ bỏ các sự kiện liên quan và lớp phủ.

- **`createToast()`**: Tạo và hiển thị thông báo toast. Bao gồm các phần tử con như:
  - **`toastMessage`**: Hiển thị thông điệp chính.
  - **`closeIconWrapper`**: Phần tử chứa biểu tượng đóng.
  - **`undoToastWrapper`**: Phần tử chứa tùy chọn hoàn tác.

  - **`delegateToast(e)`**: Xử lý sự kiện khi người dùng nhấp chuột vào thông báo toast. Nếu nhấp vào khu vực ngoài thông báo, thông báo sẽ bị đóng. Nếu nhấp vào tùy chọn hoàn tác, hàm `undoCallback` sẽ được gọi và thông báo sẽ bị đóng. Nếu nhấp vào biểu tượng đóng, thông báo sẽ bị đóng.

  - **`handleToastKeydown(e)`**: Đóng thông báo khi nhấn bất kỳ phím nào.

- **`createToast(message, undoCallback)`**: Hàm chính để tạo và hiển thị thông báo toast với thông điệp và hàm hoàn tác. Gọi `createToast()` để thực hiện việc này.

### Sử Dụng
- Gọi `createToast(message, undoCallback)` để hiển thị thông báo toast với thông điệp và hàm hoàn tác (nếu có).

# dayview.js
Hàm `setDayView`

Thiết lập giao diện ngày cho lịch:

- **`firstLastDates(bxs)`**: Tính toán thời gian bắt đầu và kết thúc của các box trong giao diện ngày.
- **`getDayviewHeaderEntryCount()`**: Tính toán số lượng mục trong giao diện ngày và trả về thông tin liên quan.
- **`createDVSideGridCells()`**: Tạo các ô lưới bên cạnh giao diện ngày với thời gian trong ngày.
- **`configHeader()`**: Cấu hình tiêu đề của giao diện ngày, bao gồm ngày, ngày trong tuần và thông tin số lượng mục.
- **`resetDayview()`**: Đặt lại giao diện ngày, xóa các box và thông tin.
- **`openDvMore(entr)`**: Mở popup hiển thị thông tin chi tiết về các mục kéo dài qua nhiều ngày.
- **`openStackEntryOnTop(e, closearg)`**: Mở form chi tiết cho một mục khi nhấp vào trong popup.
- **`createStackableEntriesOnTop(entr)`**: Tạo danh sách các mục chồng lên nhau ở trên giao diện ngày.
- **`createDvTop(entr)`**: Tạo giao diện trên cùng với các mục trong giao diện ngày.
- **`renderBoxes()`**: Vẽ các box trên giao diện ngày và cập nhật giao diện.
- **`resizeBoxNSDay(e, box)`**: Xử lý thay đổi kích thước của box theo chiều Bắc/Nam.
- **`dragEngineDay(e, box)`**: Xử lý kéo thả box theo chiều Bắc/Nam và Đông/Tây.
- **`handleDayviewClose()`**: Đóng các box tạm thời trong giao diện ngày.
- **`openDayviewForm(box, category, dates, type)`**: Mở form để thêm hoặc chỉnh sửa mục trong giao diện ngày.
- **`createBoxOnDragDay(e)`**: Tạo một box mới khi kéo thả trong giao diện ngày.

### Phần tử DOM

- **`dvBox`**: Một box trong giao diện ngày, được sử dụng để hiển thị các mục.
- **`dvHeader`**: Phần tiêu đề của giao diện ngày, bao gồm ngày và số lượng mục.
- **`dvSideGridCells`**: Các ô lưới bên cạnh giao diện ngày hiển thị thời gian trong ngày.
- **`dvPopup`**: Popup hiển thị thông tin chi tiết về các mục.
- **`stackableEntries`**: Danh sách các mục chồng lên nhau trong giao diện ngày.
- **`dvTop`**: Phần giao diện trên cùng với các mục trong giao diện ngày.

# listview.js
Hàm `setListView`

Thiết lập giao diện danh sách:

- **`createRowGroups(entries)`**: Tạo các nhóm hàng từ danh sách mục. Nhóm hàng được sắp xếp theo ngày và thời gian kết thúc.
- **`createRowGroupHeader(weekname, monthname, day, date, settop)`**: Tạo tiêu đề cho nhóm hàng, bao gồm tên tuần, tên tháng, ngày và ngày tháng.
- **`createRowGroupCell(entry)`**: Tạo ô nhóm hàng với màu sắc, thời gian và tiêu đề của mục.
- **`resetCellActive()`**: Xóa lớp "active" và kiểu dáng từ ô đã được nhấp.
- **`getRgContextMenu(cell)`**: Hiển thị menu ngữ cảnh khi nhấp vào ô nhóm hàng, cấu hình và mở form chỉnh sửa mục.
- **`setDayViewLV(target)`**: Chuyển sang chế độ xem ngày và thiết lập ngày dựa trên tiêu đề nhóm hàng được nhấp.
- **`delegateListview(e)`**: Xử lý các sự kiện nhấp chuột trong giao diện danh sách, bao gồm chuyển sang chế độ xem ngày và hiển thị menu ngữ cảnh.
- **`resetListview()`**: Đặt lại giao diện danh sách và xóa các mục đã hiển thị.
- **`initListView()`**: Khởi tạo giao diện danh sách, bao gồm nhóm và sắp xếp các mục, thiết lập tiêu đề và xử lý sự kiện nhấp chuột.

### Phần tử DOM

- **`dateTimeTitle`**: Tiêu đề hiển thị ngày và thời gian.
- **`listview`**: Phần tử chính của giao diện danh sách.
- **`listviewBody`**: Thân của giao diện danh sách chứa các nhóm hàng.


# monthview.js
Mã nguồn này triển khai chức năng xem tháng cho một ứng dụng lịch. Các tính năng chính bao gồm:

### Hiển thị

- Hiển thị lịch tháng với các ô ngày
- Hiển thị các sự kiện/công việc trong mỗi ô ngày
- Nhóm các sự kiện nếu có nhiều hơn 6 sự kiện trong một ngày

### Tương tác

- Kéo và thả sự kiện giữa các ngày
- Mở xem ngày khi nhấp vào số ngày
- Mở modal "xem thêm" khi có nhiều sự kiện trong một ngày
- Tạo sự kiện mới khi nhấp vào ô ngày trống

### Xử lý dữ liệu

- Lấy và cập nhật dữ liệu sự kiện từ store
- Định dạng và xử lý dữ liệu ngày tháng

### Tùy chỉnh giao diện

- Đáp ứng với các thay đổi kích thước màn hình
- Xử lý các trường hợp đặc biệt như tháng có 5 hoặc 6 tuần

### Khác

- Xử lý đóng mở form chỉnh sửa sự kiện
- Tích hợp với các thành phần khác như sidebar và datepicker

Mã nguồn sử dụng các kỹ thuật như DOM manipulation, event delegation và drag & drop để tạo trải nghiệm mượt mà cho người dùng.

## Chức năng các hàm chính

### Hiển thị và khởi tạo

- `setMonthView`: Hàm chính để khởi tạo và hiển thị chế độ xem tháng
- `renderSidebarDatepickerMonth`: Cập nhật datepicker trong sidebar
- `populateCells`: Tạo và điền các ô ngày trong lịch tháng
- `createCell`: Tạo một ô ngày đơn lẻ
- `createBox`: Tạo một hộp đại diện cho một sự kiện trong ô ngày
- `createGroupedCell`: Tạo ô nhóm cho các ngày có nhiều sự kiện

### Xử lý kéo và thả

- `dragEngineMonth`: Xử lý logic kéo và thả sự kiện giữa các ngày
- `configureForStorage`: Cập nhật dữ liệu sự kiện sau khi kéo thả
- `resetCellOnDrop`: Cập nhật giao diện ô ngày sau khi thả sự kiện

### Xử lý modal "xem thêm"

- `createMoreModal`: Tạo modal hiển thị danh sách đầy đủ sự kiện của một ngày
- `closeMoreModal`: Đóng modal "xem thêm"
- `dragOutOfModal`: Xử lý kéo sự kiện ra khỏi modal "xem thêm"

### Xử lý sự kiện người dùng

- `delegateMonthEvents`: Phân phối xử lý các sự kiện chuột trong chế độ xem tháng
- `delegateNewBox`: Xử lý tạo sự kiện mới khi nhấp vào ô ngày trống
- `openFormOnClickMV`: Mở form chỉnh sửa khi nhấp vào sự kiện

### Tiện ích và hỗ trợ

- `getDateFromAttribute`: Trích xuất thông tin ngày từ thuộc tính của phần tử
- `getCoordinatesFromCell`: Lấy tọa độ của ô trong lưới tháng
- `handleOverlay`: Quản lý hiển thị lớp overlay
- `resetMonthview`: Đặt lại trạng thái chế độ xem tháng

### Khởi tạo

- `initMonth`: Khởi tạo chế độ xem tháng, thiết lập các trình xử lý sự kiện

# weekview.js
### Hàm chính

#### `setWeekView(context, store, datepickerContext)`
Thiết lập và cấu hình giao diện tuần, bao gồm:
- Hiển thị ngày
- Tạo các ô lưới cho từng giờ
- Cấu hình các ngày trong tuần
- Render sidebar và modal

#### Các hàm phụ

- **`setDayView(e)`**: Đặt chế độ xem ngày khi người dùng chọn ngày.
- **`createWVSideGridCells()`**: Tạo các ô lưới bên cho giờ.
- **`configureDaysOfWeek()`**: Cập nhật số ngày trong tuần và đánh dấu ngày hôm nay và ngày đã chọn.
- **`renderSidebarDatepickerWeek()`**: Hiển thị sidebar datepicker cho tuần hiện tại.
- **`resetWeekviewBoxes()`**: Xóa tất cả các ô trong chế độ xem tuần.
- **`renderBoxes()`**: Hiển thị các ô cho các sự kiện trong tuần.
- **`createBoxesTop(col, len)`**: Tạo ô cho các sự kiện trong suốt cả ngày.
- **`createAllDayModalCell(entry, idx, col, handleCloseCallback)`**: Tạo ô trong modal cho các sự kiện trong suốt cả ngày.
- **`createAllDayModal(e, col, entries, idx, cell)`**: Tạo và hiển thị modal cho các sự kiện trong suốt cả ngày.
- **`openAllDayModal(e, cell)`**: Mở modal cho các sự kiện trong suốt cả ngày.
- **`getcol(idx)`**: Lấy cột theo chỉ số.
- **`handleWeekviewFormClose()`**: Đóng biểu mẫu khi đóng chế độ xem tuần.
- **`openWeekviewForm(box, coords, category, dates, type)`**: Mở biểu mẫu để tạo hoặc chỉnh sửa sự kiện.
- **`getWeekViewContextMenu(entry, handleCloseCallback, e)`**: Hiển thị menu ngữ cảnh cho một sự kiện.
- **`dragEngineWeek(e, box)`**: Xử lý sự kiện kéo thả của ô.
- **`resizeBoxNS(e, box)`**: Xử lý sự kiện thay đổi kích thước của ô theo chiều dọc.
- **`createBoxOnDrag(e)`**: Tạo ô mới khi kéo thả vào cột trống.

### Chức năng kéo và thay đổi kích thước

- **Kéo và thả**: Di chuyển ô trong giao diện tuần.
- **Thay đổi kích thước**: Thay đổi chiều cao của ô và cập nhật các thuộc tính liên quan.

### Kết luận

Mã nguồn này cung cấp các chức năng để quản lý và hiển thị lịch tuần, bao gồm việc cấu hình ngày, tạo các ô lịch, hiển thị modal cho sự kiện, và xử lý các tương tác của người dùng như kéo và thay đổi kích thước ô.

# yearview.js
Hàm chính để thiết lập và quản lý giao diện năm. Các chức năng bao gồm:

1. **`renderSidebarDatepicker`**: Hiển thị datepicker trên sidebar nếu sidebar không bị ẩn. Cập nhật ngày hiện tại trong datepicker và gọi `setSidebarDatepicker`.

2. **`renderMonthCells`**: Làm mới các ô tháng trong giao diện năm. Thực hiện các bước:
   - Xóa nội dung hiện tại.
   - Lấy dữ liệu các ngày của năm từ store.
   - Tạo và thêm các ô tháng vào giao diện.

3. **`createMonthCell`**: Tạo ô tháng với thông tin về ngày, tuần và tháng. Xây dựng tiêu đề và nội dung của ô tháng.

4. **`handleDaySelection`**: Xử lý sự kiện chọn ngày. Cập nhật ngày đã chọn và gọi `setViews` để chuyển sang chế độ ngày.

5. **`delegateYearEvents`**: Phân phối các sự kiện liên quan đến việc chọn ngày.

6. **`resetYearview`**: Đặt lại giao diện năm và xóa các sự kiện trên `yearviewGrid`.

7. **`initYearview`**: Khởi tạo giao diện năm bằng cách gọi `renderMonthCells`, thiết lập sự kiện chọn ngày và cuộn đến tháng hiện tại nếu có.

### Khởi tạo

Gọi `initYearview` để bắt đầu thiết lập giao diện năm khi hàm `setYearView` được gọi.

# appDefaults.js
Hàm này thiết lập các giá trị mặc định cho ứng dụng khi khởi động.

1. **`disableTransitionsOnLoad`**: Xóa lớp `preload` trên phần tử `appBody` sau một khoảng thời gian ngắn (4ms) để loại bỏ các hiệu ứng chuyển tiếp tạm thời khi tải.

2. **`setDefaultAnimationStatus`**: Cập nhật trạng thái hoạt ảnh của ứng dụng dựa trên giá trị `animationStatus` từ store. Thêm hoặc xóa lớp `disable-transitions` trên `appBody` tùy thuộc vào trạng thái hoạt ảnh.

3. **`setTheme`**: Gọi hàm `setTheme` để thiết lập giao diện theo chủ đề từ `context`.

Cuối cùng, hàm `setAppDefaults` thực hiện các bước:
- Gọi `disableTransitionsOnLoad` để xử lý hiệu ứng chuyển tiếp khi tải.
- Thiết lập chủ đề bằng cách gọi `setTheme`.
- Cập nhật trạng thái hoạt ảnh bằng `setDefaultAnimationStatus`.

# renderViews.js
### Các Biến

- `appBody`, `colorSchemeMeta`, `header`, `headerLogo`, v.v. - Các phần tử DOM cần thiết cho các thao tác và giao diện của ứng dụng.

### Hàm `renderViews`

Hàm này thực hiện các công việc chính để render và điều khiển các thành phần của ứng dụng.

1. **`setColorScheme`**: Thiết lập chế độ màu cho ứng dụng (sáng, tối, hoặc tương phản) dựa trên chế độ hiện tại.

2. **`fullRender(component)`**: Render lại toàn bộ giao diện dựa trên thành phần hiện tại (`day`, `week`, `month`, `year`).

3. **`setInitialAttributes`**: Thiết lập các thuộc tính ban đầu cho các phần tử như logo tiêu đề.

4. **`renderSidebarDatepicker`**: Hiển thị lịch sidebar nếu sidebar không bị ẩn.

5. **`renderSidebarCategories`**: Hiển thị các danh mục và footer của sidebar nếu sidebar không bị ẩn.

6. **Các Hàm Điều Hướng Thời Gian**: `getPreviousDay`, `getNextDay`, `getPreviousWeek`, `getNextWeek`, `getPreviousMonth`, `getNextMonth`, `getPreviousYear`, `getNextYear` - Điều chỉnh thời gian và render lại giao diện tương ứng.

7. **`handleTransition`**: Xử lý các chuyển tiếp khi di chuyển giữa các khoảng thời gian để đảm bảo chuyển tiếp mượt mà.

8. **`handleForm`**: Mở form nhập liệu và cập nhật trạng thái hiển thị của form.

9. **`handleToggleSubmenu`**: Mở menu cài đặt bên cạnh nút "Tạo" trong sidebar.

10. **`handleBtnMainMenu`**: Mở hoặc đóng sidebar, thiết lập trạng thái và các thuộc tính liên quan.

11. **`handleBtnToday`**: Đặt ngày hiện tại làm ngày chọn và render lại giao diện.

12. **`handleBtnPrev` và `handleBtnNext`**: Xử lý các thao tác điều hướng đến ngày, tuần, tháng, hoặc năm trước/tiếp theo dựa trên thành phần hiện tại.

13. **`handleDatePickerBtn`**: Hiển thị lịch và đặt vị trí của nó dựa trên vị trí của nút được nhấp.

14. **`setOptionStyle`**: Cập nhật kiểu dáng cho các tùy chọn giao diện.

15. **`closeOptionsModal`**: Đóng modal tùy chọn.

16. **`renderOption`**: Cập nhật giao diện dựa trên tùy chọn chọn và đóng modal tùy chọn.

17. **`handleSelect`**: Mở modal chọn chế độ xem và xử lý các tùy chọn.

18. **`delegateHeaderEvents`**: Xử lý các sự kiện từ các phần tử trên tiêu đề của ứng dụng.

19. **`delegateGlobalKeyDown`**: Xử lý các sự kiện phím toàn cục để điều khiển các thao tác như thay đổi chế độ xem, mở sidebar, v.v.

20. **`handleCollapse`**: Xử lý việc mở rộng và thu nhỏ các tiêu đề của chế độ xem ngày hoặc tuần.

21. **`appinit`**: Khởi tạo ứng dụng, thiết lập các sự kiện toàn cục và các callback cần thiết.

Hàm `renderViews` phối hợp các thành phần của ứng dụng để đảm bảo giao diện và các chức năng hoạt động trơn tru.

# setViews.js
Đoạn mã này định nghĩa hàm `setViews` dùng để thiết lập các chế độ xem khác nhau cho ứng dụng lịch. Hàm này có nhiệm vụ ẩn các chế độ xem hiện tại và hiển thị chế độ xem mới dựa trên tham số đầu vào.

#### Các thành phần chính

- **Các thành phần**:
  - `yearComponent`: Thành phần hiển thị năm.
  - `monthComponent`: Thành phần hiển thị tháng.
  - `weekComponent`: Thành phần hiển thị tuần.
  - `dayComponent`: Thành phần hiển thị ngày.
  - `listComponent`: Thành phần hiển thị danh sách.

- **Các chức năng**:
  - `hideViews()`: Ẩn tất cả các chế độ xem hiện tại. Nếu có chế độ xem trước đó, nó sẽ được đặt lại nếu cần.
  - `initView(component)`: Thiết lập và hiển thị chế độ xem dựa trên tham số `component`:
    - `day`: Hiển thị chế độ xem ngày và thiết lập tiêu đề cho chế độ xem ngày.
    - `week`: Hiển thị chế độ xem tuần và thiết lập tiêu đề cho chế độ xem tuần.
    - `month`: Hiển thị chế độ xem tháng và thiết lập tiêu đề cho chế độ xem tháng.
    - `year`: Hiển thị chế độ xem năm và thiết lập tiêu đề cho chế độ xem năm.
    - `list`: Hiển thị chế độ xem danh sách và thiết lập tiêu đề cho chế độ xem danh sách.

- **Khởi tạo**:
  - Ẩn tất cả các chế độ xem hiện tại.
  - Thiết lập tiêu đề của trang với tên tháng hiện tại.
  - Gọi hàm `initView` để hiển thị chế độ xem mới dựa trên tham số đầu vào.

Hàm này giúp chuyển đổi giữa các chế độ xem của ứng dụng lịch một cách mượt mà và có kiểm soát.

# appContext.js
Lớp `Context` quản lý các cài đặt và trạng thái của ứng dụng liên quan đến ngày tháng và giao diện. Các phương thức chính của lớp này bao gồm:

- **Khởi tạo**:
  - `colorScheme`: chế độ màu của ứng dụng (tối hoặc sáng).
  - `component`: thành phần hiện tại (tháng).
  - `sidebarState`: trạng thái sidebar (ẩn hoặc hiện).
  - `date`, `dateSelected`, `daySelected`, `monthSelected`, `yearSelected`: các giá trị liên quan đến ngày tháng hiện tại và được chọn.

- **Cài đặt mặc định**:
  - `setDateDefaults()`: Cài đặt các giá trị mặc định cho ngày tháng từ `localStorage`.
  - `setSchemaDefaults()`: Cài đặt các giá trị mặc định cho giao diện từ `localStorage`.
  - `setDefaults()`: Kết hợp cả hai phương thức trên để cài đặt tất cả các giá trị mặc định.

- **Quản lý trạng thái địa phương**:
  - Các phương thức `getLocal*` và `setLocal*` dùng để lấy và lưu trạng thái vào `localStorage`.

- **Quản lý giao diện ứng dụng**:
  - `getColorScheme()`, `setColorScheme(colorScheme)`: Lấy và cài đặt chế độ màu.
  - `setSidebarState(state)`, `toggleSidebarState()`: Cài đặt và chuyển đổi trạng thái sidebar.
  - `getComponent()`, `setComponent(component)`: Lấy và cài đặt thành phần hiện tại.

- **Xử lý ngày tháng ứng dụng**:
  - Các phương thức như `setDay(day)`, `setMonth(month)`, `setYear(year)`, `setDate(year, month, day)` dùng để cài đặt các giá trị ngày tháng.
  - Các phương thức `setPrev*` và `setNext*` để điều chỉnh ngày tháng theo hướng quá khứ hoặc tương lai.
  - Các phương thức như `getDate()`, `getToday()`, `getWeek()`, `getWeekday()`, `getWeekArray()`, và `getMonthArray()` để lấy thông tin về ngày tháng hiện tại và tuần.

- **Các phương thức bổ sung**:
  - `isToday(testDate)`: Kiểm tra xem ngày tháng có phải là hôm nay không.

### `DatepickerContext` Class

Lớp `DatepickerContext` là phiên bản rút gọn của `Context`, chuyên dùng cho việc chọn ngày tháng.

- **Khởi tạo**:
  - Tương tự như `Context`, nhưng chỉ chứa các thuộc tính và phương thức cần thiết cho việc chọn ngày tháng.

- **Cài đặt mặc định**:
  - `setDefaults()`: Cài đặt các giá trị mặc định cho `DatepickerContext`.

- **Quản lý trạng thái địa phương**:
  - Các phương thức `getLocalPicker*` và `setLocalPicker*` tương tự như trong lớp `Context`.

- **Xử lý ngày tháng**:
  - Các phương thức `setDay(day)`, `setMonth(month)`, `setYear(year)`, `setDate(year, month, day)` tương tự như trong lớp `Context`, nhưng được sử dụng cho `DatepickerContext`.
  - Các phương thức `setPrevMonth()` và `setNextMonth()` để điều chỉnh tháng.

# constants.js
Chứa các khóa lưu trữ cục bộ

# store.js
## Chức năng các hàm chính

### Quản lý dữ liệu cơ bản
- `addEntry(entry)`: Thêm một mục nhập mới vào store
- `createEntry(...args)`: Tạo và thêm một mục nhập mới
- `deleteEntry(id)`: Xóa một mục nhập theo ID
- `getEntry(id)`: Lấy một mục nhập theo ID
- `updateEntry(id, data)`: Cập nhật thông tin của một mục nhập

### Lọc và sắp xếp
- `searchBy(entries, searchtype, value)`: Tìm kiếm mục nhập theo tiêu chí
- `sortBy(entries, type, direction)`: Sắp xếp các mục nhập
- `getFirstAndLastEntry()`: Lấy mục nhập đầu tiên và cuối cùng theo thời gian

### Phân đoạn dữ liệu cho chế độ xem
- `getDayEntries(day)`: Lấy các mục nhập cho một ngày cụ thể
- `getMonthEntries(montharr)`: Lấy các mục nhập cho một tháng
- `getWeekEntries(week)`: Lấy các mục nhập cho một tuần
- `getYearEntries(year)`: Lấy các mục nhập cho một năm

### Quản lý danh mục
- `addNewCtg(categoryName, color)`: Thêm danh mục mới
- `deleteCategory(category)`: Xóa danh mục
- `getActiveCategories()`: Lấy danh sách các danh mục đang hoạt động
- `setCategoryStatus(category, status)`: Đặt trạng thái hoạt động cho danh mục
- `updateCtgColor(categoryName, color)`: Cập nhật màu sắc của danh mục

### Quản lý phím tắt và hoạt ảnh
- `getShortcuts()`: Lấy danh sách phím tắt
- `setShortcutsStatus(status)`: Đặt trạng thái cho phím tắt
- `setAnimationStatus(status)`: Đặt trạng thái cho hoạt ảnh

### Quản lý lớp phủ
- `addActiveOverlay(overlay)`: Thêm lớp phủ đang hoạt động
- `removeActiveOverlay(overlay)`: Xóa lớp phủ đang hoạt động
- `hasActiveOverlay()`: Kiểm tra có lớp phủ đang hoạt động không

### Xử lý JSON
- `validateUserUpload(userUpload)`: Kiểm tra tính hợp lệ của dữ liệu tải lên
- `setUserUpload(userUpload)`: Cập nhật localStorage với dữ liệu tải lên

### Quản lý trạng thái render
- `setFormRenderHandle(type, callback)`: Đặt callback cho việc render form
- `setRenderSidebarCallback(callback)`: Đặt callback cho việc render sidebar
- `setResizeHandle(type, callback)`: Đặt callback cho việc thay đổi kích thước
- `getRenderFormCallback()`: Lấy callback cho việc render f

# entries.js
Lớp này đại diện cho một tuần và quản lý các mục (entries) trong tuần:
- `boxes` (Array): Mảng các mục trong một ngày.
- `boxesTop` (Array): Mảng các mục kéo dài nhiều ngày.

Các phương thức chính:
- `setAllBoxes(tempEntries)`: Cập nhật tất cả các mục.
- `addBox(box)`: Thêm một mục vào `boxes`.
- `addBoxTop(box)`: Thêm một mục vào `boxesTop`.
- `getBox(id)`: Lấy mục theo ID.
- `getBoxes()`: Lấy tất cả các mục trong ngày.
- `getBoxesTop()`: Lấy tất cả các mục kéo dài nhiều ngày.
- `getLength()`: Lấy số lượng mục trong ngày.
- `getBoxesByColumn(col)`: Lấy các mục theo cột.
- `getBoxesTopByDay(day)`: Lấy các mục kéo dài theo ngày.
- `getBoxesTopLengths()`: Lấy số lượng mục kéo dài theo ngày trong tuần.
- `getColumnsWithMultipleBoxes()`: Lấy các cột có nhiều mục.
- `getEntriesByTitle(title)`: Lấy các mục theo tiêu đề.
- `updateCoordinates(id, coordinates)`: Cập nhật tọa độ của mục.
- `sortByY(bxs)`: Sắp xếp các mục theo tọa độ Y.
- `checkForCollision(col)`: Kiểm tra sự va chạm của các mục theo cột.
- `updateStore(store, id, weekArray)`: Cập nhật thông tin mục trong lưu trữ.

### Lớp `Day`

Lớp này quản lý các mục trong một ngày cụ thể:
- `boxes` (Array): Mảng các mục trong ngày.
- `boxesTop` (Array): Mảng các mục kéo dài nhiều ngày.

Các phương thức chính:
- `setAllBoxes(tempEntries)`: Cập nhật tất cả các mục.
- `addBox(box)`: Thêm một mục vào `boxes`.
- `addBoxTop(box)`: Thêm một mục vào `boxesTop`.
- `getBox(id)`: Lấy mục theo ID.
- `getBoxes()`: Lấy tất cả các mục trong ngày.
- `getBoxesTop()`: Lấy tất cả các mục kéo dài nhiều ngày.
- `getAllBoxes()`: Lấy tất cả các mục (bao gồm cả kéo dài nhiều ngày).
- `getLength()`: Lấy số lượng mục trong ngày.
- `getBoxesTopLengths()`: Lấy số lượng mục kéo dài theo ngày trong tuần.
- `getEntriesByTitle(title)`: Lấy các mục theo tiêu đề.
- `updateCoordinates(id, coordinates)`: Cập nhật tọa độ của mục.
- `getEntriesEndingOnDay(day)`: Lấy các mục kết thúc vào ngày cụ thể.
- `sortByY(bxs)`: Sắp xếp các mục theo tọa độ Y.
- `checkForCollision()`: Kiểm tra sự va chạm của các mục.
- `updateStore(store, id)`: Cập nhật thông tin mục trong lưu trữ.

### Export

Các lớp `CoordinateEntry`, `Week`, và `Day` được Export để sử dụng trong các phần khác của ứng dụng.

# queries.js
Lớp `MonthBoxQuery` quản lý các thuộc tính liên quan đến giao diện dựa trên kích thước của cửa sổ trình duyệt.

### Các Thuộc Tính
- `flag` (Boolean): Biến đánh dấu trạng thái giao diện dựa trên kích thước của cửa sổ.
- `tops` (Array): Mảng chứa các giá trị chiều trên (top) tương ứng với các trạng thái.
- `heights` (Array): Mảng chứa các giá trị chiều cao tương ứng với các trạng thái.

### Các Phương Thức

- `constructor(flag)`: Khởi tạo đối tượng với giá trị `flag` ban đầu và thiết lập các giá trị mặc định cho `tops` và `heights`.

- `updateFlag()`: Cập nhật giá trị `flag` dựa trên kích thước hiện tại của cửa sổ. Nếu chiều rộng của cửa sổ nhỏ hơn hoặc bằng 530 hoặc chiều cao nhỏ hơn hoặc bằng 470, `flag` sẽ được đặt thành `true`.

- `getFlag()`: Trả về giá trị hiện tại của `flag`.

- `getTop()`: Trả về giá trị chiều trên (top) dựa trên giá trị của `flag`. Nếu `flag` là `true`, trả về giá trị đầu tiên trong mảng `tops`, ngược lại trả về giá trị thứ hai.

- `getHeight()`: Trả về giá trị chiều cao dựa trên giá trị của `flag`. Nếu `flag` là `true`, trả về giá trị đầu tiên trong mảng `heights`, ngược lại trả về giá trị thứ hai.

- `getPrevTop(top)`: Trả về giá trị chiều trên (top) trước đó dựa trên giá trị đầu vào. Nếu giá trị đầu vào bằng giá trị đầu tiên trong mảng `tops`, trả về giá trị thứ hai, ngược lại trả về giá trị đầu tiên.

### Xuất khẩu

Lớp `MonthBoxQuery` được xuất khẩu để sử dụng trong các phần khác của ứng dụng.


# en.js
### Các Nhãn (Labels)

- `monthsLong`: Danh sách tên các tháng trong năm bằng tiếng Anh (dài).
- `monthsShortLower`: Danh sách viết tắt của các tháng trong năm bằng chữ thường.
- `monthsLongLower`: Danh sách tên các tháng trong năm bằng chữ thường.
- `monthsShort`: Danh sách viết tắt của các tháng trong năm bằng chữ hoa.
- `weekdaysLong`: Danh sách tên các ngày trong tuần bằng tiếng Anh (dài).
- `weekdaysShort`: Danh sách viết tắt của các ngày trong tuần.
- `weekdaysNarrow`: Danh sách ký tự viết tắt của các ngày trong tuần (rất ngắn).

### Màu Sắc (Colors)

Các màu sắc được sử dụng cho các danh mục trong lịch được phân loại theo màu:

# kbDefault.js
## Tóm Tắt Phím Tắt

- **0**: `0` - Thay đổi giao diện ứng dụng.
- **1**: `1`, `D` - Mở chế độ xem ngày.
- **2**: `2`, `W` - Mở chế độ xem tuần.
- **3**: `3`, `M` - Mở chế độ xem tháng.
- **4**: `4`, `Y` - Mở chế độ xem năm.
- **5**: `5`, `L` - Mở chế độ xem danh sách.
- **6**: `v` - Chuyển đổi tùy chọn chế độ xem.
- **7**: `t` - Đặt ngày thành hôm nay.
- **8**: `g` - Nhập ngày một cách thủ công.
- **9**: `n` - Thay đổi sang khoảng thời gian tiếp theo.
- **10**: `p` - Thay đổi sang khoảng thời gian trước đó.
- **11**: `s` - Chuyển đổi thanh bên.
- **12**: `f` - Mở biểu mẫu.
- **13**: `+` - Mở biểu mẫu thêm danh mục mới.
- **14**: `a` - Mở cài đặt.
- **15**: `/`, `?` - Mở danh sách phím tắt bàn phím.
- **16**: `e` - (Tùy chọn mục) Mở biểu mẫu với chi tiết mục.
- **17**: `↑` - 
  - (Chọn ngày) Đặt ngày thành tháng/tuần tiếp theo.
  - (Chọn năm) Đặt năm thành năm tiếp theo.
- **18**: `↓` - 
  - (Chọn ngày) Đặt ngày thành tháng/tuần trước đó.
  - (Chọn năm) Đặt năm thành năm trước đó.
- **19**: `←` - 
  - (Chọn ngày) Đặt ngày thành ngày trước đó.
  - (Chọn tháng) Đặt tháng thành tháng trước đó.
- **20**: `→` - 
  - (Chọn ngày) Đặt ngày thành ngày tiếp theo.
  - (Chọn tháng) Đặt tháng thành tháng tiếp theo.
- **21**: `DELETE` - (Tùy chọn mục) Xóa mục.
- **22**: `ENTER` - 
  - (Chọn ngày) Đặt ngày thành ngày đã chọn.
  - (Biểu mẫu) Gửi biểu mẫu.
- **23**: `ESCAPE` - Đóng bất kỳ hộp thoại/modal biểu mẫu nào đang mở.


# dateutils.js
## Tóm Tắt Các Hàm

- **`createDate(year, month, day)`**: Tạo một chuỗi ngày tháng theo định dạng ISO. Nếu không có tham số, trả về ngày hiện tại.

- **`testDate(date)`**: Kiểm tra xem giá trị có phải là một đối tượng `Date` hợp lệ không.

- **`getDateFormatted(date)`**: Trả về ngày theo định dạng `YYYY-MM-DD`.

- **`getDateForStore(date)`**: Trả về ngày theo định dạng `YYYY-M-D`, dùng cho lưu trữ.

- **`getdatearray(date)`**: Trả về mảng chứa năm, tháng, ngày từ đối tượng `Date`.

- **`formatDateForDisplay(date)`**: Trả về ngày theo định dạng `Tháng Ngày Năm, (Giờ:Phút)`.

- **`compareDates(date1, date2)`**: So sánh hai ngày và trả về `true` nếu chúng cùng năm, tháng, ngày.

- **`formatDuration(seconds)`**: Định dạng khoảng thời gian từ số giây thành chuỗi như "2 days, 3 hours".

- **`formatDurationHourMin(seconds)`**: Định dạng khoảng thời gian từ số giây thành chuỗi như "1 hour, 15 minutes".

- **`formatStartEndDate(start, end, flag)`**: Định dạng ngày bắt đầu và kết thúc thành chuỗi mô tả thời gian.

- **`formatStartEndTime(start, end)`**: Định dạng thời gian bắt đầu và kết thúc thành chuỗi `Giờ:Phút – Giờ:Phút`.

- **`getDuration(start, end)`**: Tính toán khoảng thời gian giữa hai ngày và định dạng thành chuỗi.

- **`createDateFromFormattedString(dateString)`**: Tạo đối tượng `Date` từ chuỗi ngày tháng theo định dạng `YYYY-MM-DD`.

- **`isBeforeDate(date1, date2)`**: Kiểm tra xem `date1` có trước `date2` không.

- **`isDate(value)`**: Kiểm tra xem giá trị có phải là một đối tượng `Date` hợp lệ không.

- **`getDateFromAttribute(target, attribute, view)`**: Trả về ngày từ thuộc tính của đối tượng DOM, theo định dạng `YYYY-MM-DD` hoặc `YYYY-M-D`.

- **`getTimeFromAttribute(target, attribute)`**: Trả về giờ và phút từ thuộc tính của đối tượng DOM, theo định dạng `HH:MM`.

- **`getDateTimeFormatted(date, hour, minute)`**: Tạo một đối tượng `Date` với ngày, giờ, phút cụ thể.

- **`getTempDates(tempdate, hours, minutes)`**: Tạo một mảng chứa hai đối tượng `Date` với giờ và phút cụ thể.

- **`generateTempStartEnd(data)`**: Tạo hai đối tượng `Date` với thời gian bắt đầu và kết thúc trong ngày hiện tại.

- **`getFormDateObject(start, end)`**: Trả về đối tượng chứa ngày bắt đầu, kết thúc, phút và ngày đã định dạng.

- **`sortDates(dates, dir)`**: Sắp xếp mảng ngày theo thứ tự tăng dần hoặc giảm dần.

- **`formatEntryOptionsDate(date1, date2)`**: Định dạng ngày và thời gian của hai đối tượng `Date` thành chuỗi mô tả, bao gồm khoảng thời gian nếu khác nhau.

- **`createTimestamp()`**: Tạo chuỗi định danh thời gian theo định dạng `MMDD` của ngày hiện tại.

- **`longerThanDay(date1, date2)`**: Kiểm tra xem khoảng thời gian giữa hai ngày có dài hơn một ngày không.

- **`getDayOrdinal(day)`**: Trả về hậu tố thứ tự của ngày (như "st", "nd", "rd", "th").


# dragutils.js
### Các Hàm

- **`calcNewLeft(index)`**: Tính toán vị trí bên trái của hộp dựa trên chỉ số.

- **`setBoxWidthWeek(box, prepend, dataidx)`**: Đặt chiều rộng của hộp cho chế độ xem tuần.

- **`setBoxWidthDay(box, prepend, dataidx)`**: Đặt chiều rộng của hộp cho chế độ xem ngày.

- **`handleOverlap(col, view, boxes)`**: Xử lý va chạm giữa các hộp trong chế độ xem ngày hoặc tuần.

- **`setStylingForEvent(clause, wrapper, store)`**: Cập nhật kiểu dáng cho các sự kiện kéo và thay đổi kích thước.

- **`updateBoxCoordinates(box, view, boxes)`**: Cập nhật tọa độ của hộp.

- **`setBoxTimeAttributes(box, view)`**: Đặt các thuộc tính thời gian cho hộp.

- **`createBox(col, entry, view, color)`**: Tạo một hộp mới với các thuộc tính và kiểu dáng.

- **`createTemporaryBox(box, col, hasSibling, view)`**: Tạo một hộp tạm thời.

- **`getBoxDefaultStyle(y, backgroundColor)`**: Lấy kiểu dáng mặc định cho hộp.

- **`resetStyleOnClick(view, box)`**: Đặt lại kiểu dáng của hộp khi nhấp chuột.

- **`createTempBoxHeader(view)`**: Tạo tiêu đề cho hộp tạm thời.

- **`startEndDefault(y)`**: Tính toán thời gian bắt đầu và kết thúc mặc định từ vị trí Y.

- **`calcNewHourFromCoords(h, y)`**: Tính toán giờ mới từ tọa độ.

- **`calcNewMinuteFromCoords(h, y)`**: Tính toán phút mới từ tọa độ.

- **`calcDateOnClick(date, start, length)`**: Tính toán ngày bắt đầu và kết thúc dựa trên ngày, thời gian bắt đầu và độ dài.

- **`getOriginalBoxObject(box)`**: Lấy đối tượng hộp gốc.

- **`resetOriginalBox(box, boxorig)`**: Đặt lại hộp về trạng thái gốc.

### Các Biến

- **`identifiers`**: Chứa các định danh cho các hộp và thuộc tính.

- **`calcTime`**: Hàm được nhập khẩu từ `./timeutils`.

### Quy Trình Xử Lý Kéo / Thay Đổi Kích Thước

1. **Capture**: Lấy vị trí của con trỏ chuột và xác định điểm bắt đầu/kết thúc.
2. **Relay**: Cập nhật vị trí mới và áp dụng các quy tắc kiểu dáng cho phần tử mục tiêu.
3. **Render**: Kích hoạt tất cả các logic render khi thả chuột.
# helpers.js
## Tóm tắt các hàm

- **`debounce(func, limit)`**: Trả về một hàm chỉ được gọi sau khi hàm gốc không được gọi trong khoảng thời gian xác định.

- **`getClosest(e, element)`**: Trả về phần tử gần nhất của `e` khớp với bộ chọn `element`.

- **`hextorgba(hex, alpha)`**: Chuyển đổi mã màu hex sang định dạng màu rgba với độ alpha.

- **`generateId()`**: Tạo một ID duy nhất dựa trên thời gian hiện tại và một số ngẫu nhiên.

- **`throttle(fn, wait)`**: Trả về một hàm chỉ được gọi không quá một lần trong khoảng thời gian xác định.

- **`setTheme(context)`**: Cập nhật chủ đề màu của ứng dụng dựa trên thông tin trong `context`.

- **`placePopup(popupWidth, popupHeight, coords, windowCoords, center, targetWidth)`**: Tính toán vị trí của popup để hiển thị phù hợp với kích thước và vị trí hiện tại.

- **`isNumeric(n)`**: Kiểm tra xem một giá trị có phải là số hay không.


# svgs.js
## Tóm tắt các hàm

- **`createStatusIcon`**: Tạo một biểu tượng trạng thái với hình dạng và màu sắc xác định.

- **`createCategoryIcon`**: Tạo một biểu tượng danh mục với hình dạng và màu sắc xác định.

- **`createEditIcon`**: Tạo một biểu tượng chỉnh sửa với hình dạng và màu sắc xác định.

- **`createPencilIcon(fill)`**: Tạo một biểu tượng bút chì với màu sắc có thể được tùy chỉnh.

- **`createTrashIcon(fill)`**: Tạo một biểu tượng thùng rác với màu sắc có thể được tùy chỉnh.

- **`createCloseIcon(fill)`**: Tạo một biểu tượng đóng với màu sắc có thể được tùy chỉnh.

- **`createCaretDownIcon(fill)`**: Tạo một biểu tượng mũi tên hướng xuống với màu sắc có thể được tùy chỉnh.

- **`createCaretUpIcon(fill)`**: Tạo một biểu tượng mũi tên hướng lên với màu sắc có thể được tùy chỉnh.

- **`createCaretRightIcon(fill)`**: Tạo một biểu tượng mũi tên hướng sang phải với màu sắc có thể được tùy chỉnh.

- **`createCheckIcon(fill)`**: Tạo một biểu tượng dấu kiểm với màu sắc có thể được tùy chỉnh.

- **`createCheckBoxIcon(fill)`**: Tạo một biểu tượng hộp kiểm với màu sắc có thể được tùy chỉnh.

- **`createMeatballVertIcon(fill)`**: Tạo một biểu tượng ba chấm dọc với màu sắc có thể được tùy chỉnh.

- **`createExpandDownIcon(fill)`**: Tạo một biểu tượng mũi tên mở rộng xuống với màu sắc có thể được tùy chỉnh.
### Nội dung chính 

Đoạn code định nghĩa và xuất các hàm để tạo ra các biểu tượng SVG với các kích thước và màu sắc khác nhau. Các hàm này sử dụng XML namespaces của SVG để tạo và cấu hình các phần tử hình ảnh. Mỗi hàm trả về một phần tử SVG với các thuộc tính và hình dạng đã được thiết lập sẵn. Các biểu tượng này có thể được sử dụng để đại diện cho các chức năng khác nhau trong giao diện người dùng của ứng dụng web.

# testing.js
## Tóm tắt các hàm và lớp

### Các hàm

- **`generateStart`**: Tạo một đối tượng `Date` đại diện cho ngày giờ bắt đầu của sự kiện. Thời gian được tạo ra ngẫu nhiên trong khoảng từ 8 giờ sáng đến 12 giờ trưa, với phút chia theo khoảng 15 phút.

- **`generateEnd(start)`**: Tạo một đối tượng `Date` đại diện cho ngày giờ kết thúc của sự kiện. Thời gian kết thúc là ngẫu nhiên, nhưng phải sau thời gian bắt đầu ít nhất một ngày và muộn hơn thời gian bắt đầu từ 12 giờ trưa.

- **`generateRandomEvents(numberOfEvents)`**: Tạo một danh sách các sự kiện ngẫu nhiên. Số lượng sự kiện được xác định bởi tham số `numberOfEvents`, với giá trị mặc định là 100 nếu tham số không hợp lệ. Mỗi sự kiện bao gồm thông tin về danh mục, trạng thái hoàn thành, mô tả, ngày giờ bắt đầu và kết thúc, cùng với tiêu đề ngẫu nhiên.

### Lớp

- **`FEntry`**: Lớp đại diện cho một sự kiện. Nó chứa các thuộc tính bao gồm danh mục, trạng thái hoàn thành, mô tả, ngày giờ bắt đầu, ngày giờ kết thúc, id (được tạo ngẫu nhiên) và tiêu đề.

# timeutils.js
## Tóm tắt các hàm

### **`formatTime(hours, minutes)`**
- Định dạng giờ và phút thành chuỗi thời gian theo định dạng 12 giờ với chỉ định "am" hoặc "pm".
- Nếu phút là 60, nó sẽ được đặt thành 0 và giờ sẽ tăng thêm 1.

### **`formatStartEndTimes(hours, minutes)`**
- Định dạng giờ bắt đầu và giờ kết thúc thành chuỗi thời gian theo định dạng 12 giờ.
- Nếu giờ bắt đầu và giờ kết thúc thuộc cùng một khoảng thời gian (AM hoặc PM), nó chỉ hiển thị một khoảng thời gian chung.

### **`configMinutesForStore(minutes)`**
- Đảm bảo phút luôn có định dạng hai chữ số, ví dụ: "00" thay vì "0".

### **`calcTime(start, length)`**
- Tính toán và định dạng thời gian bắt đầu và kết thúc dựa trên thời gian bắt đầu và độ dài của sự kiện.
- Trả về chuỗi thời gian định dạng theo khoảng thời gian bắt đầu và kết thúc.

### **`compareTimes(time1, time2)`**
- So sánh hai thời gian và tính toán sự chênh lệch bằng phút.
- Nếu sự chênh lệch âm, nó sẽ trả về sự khác biệt gần nhất trong khoảng 15 phút.

### **Xuất khẩu**
- **`calcTime`**: Hàm chính để tính toán thời gian.
- Các hàm khác bao gồm **`configMinutesForStore`**, **`formatStartEndTimes`**, **`formatTime`**, và **`compareTimes`**.


# webpack.config.js
### Tóm tắt nội dung tổng quan

### 1. **Cấu hình Webpack**
- **`entry`**: Điểm nhập của ứng dụng là `./src/index.js`.
- **`mode`**: Chế độ phát triển (`development`).
- **`devServer`**: Cấu hình server phát triển, bao gồm cổng, tính năng hot module replacement, và nén tài nguyên.
- **`devtool`**: Tạo bản đồ nguồn để gỡ lỗi (`source-map`).
- **`module`**:
  - Quy tắc xử lý các loại tệp: JavaScript, CSS, font, và hình ảnh.
- **`plugins`**:
  - **`HtmlWebpackPlugin`**: Tạo tệp HTML với tiêu đề, favicon, và liên kết đến các tệp bundle.
  - **`MiniCssExtractPlugin`**: Tách CSS thành các tệp riêng biệt.
  - **`WebpackManifestPlugin`**: Tạo tệp `manifest.json` với thông tin tài nguyên.
- **`optimization`**: Kích hoạt tối ưu hóa với các công cụ như `TerserPlugin` và `CssMinimizerPlugin`.
- **`output`**: Cấu hình tệp đầu ra (`bundle.js`) và thư mục đầu ra (`dist`).

### 2. **Các hàm hỗ trợ**
- **`formatTime(hours, minutes)`**: Định dạng giờ và phút thành chuỗi thời gian với định dạng `am/pm`.
- **`formatStartEndTimes(hours, minutes)`**: Định dạng khoảng thời gian bắt đầu và kết thúc.
- **`configMinutesForStore(minutes)`**: Đảm bảo phút luôn có định dạng hai chữ số.
- **`calcTime(start, length)`**: Tính toán thời gian bắt đầu và kết thúc dựa trên thời gian bắt đầu và độ dài.
- **`compareTimes(time1, time2)`**: So sánh hai thời gian và trả về sự khác biệt hoặc thời gian gần nhất.

### 3. **Tạo sự kiện ngẫu nhiên**
- **`generateRandomEvents(numberOfEvents)`**: Tạo một mảng các sự kiện ngẫu nhiên với thông tin như tiêu đề, mô tả, và thời gian bắt đầu, kết thúc.

### 4. **Cấu hình Webpack**
- **`HtmlWebpackPlugin`**: Tạo tệp HTML với các tùy chọn như tiêu đề và favicon.
- **`MiniCssExtractPlugin`**: Tách CSS ra thành các tệp riêng biệt.
- **`WebpackManifestPlugin`**: Tạo tệp `manifest.json`.
- **`TerserPlugin` và `CssMinimizerPlugin`**: Tối ưu hóa mã JavaScript và CSS.
