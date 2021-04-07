#IDE
- IDE dùng Visual Code
- Một số plugin bắt buộc
    + Auto close tag
    + Auto rename tag
    + Eslint
    + Gitlens
    + Prettier
    + React native snippet
    + Tint
- Phím tắt format code với Prettier là Alt + Shift + F

**Quy tắc code**
+ Quy tắc đặt tên :
    - Tên hàm, biến, class... trừ comment code thì phải viết tiếng Anh (Nếu ko biết thì dùng google dịch)
    - Tên class theo chuẩn PascalCase (bất đầu bằng chữ HOA, và phân đoạn bằng chữ HOA đầu, trừ file index.js, styles.js VD PlashScreen), và phải thể hiện đến đối tượng
    - Tên hàm, tên biến dùng chuẩn camelCase (bắt đầu bằng chữ thường, những chữ tiếp theo viết hoa chữ đầu, ko dùng dấu _ để đăt tên biến, hàm)
    - Tên hàm, biến phải thể hiện rõ mục đích của chúng, nếu ko tìm được từ ngữ thì cần có comment trước khi khai báo hàm, biến
    - Tên hàm trong file component thì dùng arrow function (trừ một số hàm mặc định của component componentDidMoung, render...)
    
    - Tiền tố
        - Tên hàm xử lý sự kiện
            + Để click button thì bắt đầu bằng tiền tố ```onPress``` VD ```onPressLogin```
            + Để update text input thì bắt đầu bằng tiền tố ```onChange```  VD ```onChangeUserName```
        - Hàm chức năng (action)
            + Không nên dùng tiền tố cho hàm chức năng VD thay vì viết ```onChangeLanguage``` thì nên viết ```changeLanguage```
        - Component
            + Nên dùng tiền tố ```Item``` ```List``` cho một số component liên quan đến danh sách
    - Hậu tố
        - Tên class nên có hậu tố thể hiện chức năng của class
            + Một số hậu tố cơ bản của component View, Text, Input, Label, Button, Container, Modal, Menu, Icon, Alert, Swiper, Screen...
            + Một file ko được có 2 hậu tố cơ bản VD SearchInputView => SearchInput
        
    VD:
    ```
    var isShowNotification
    processCameraCapture() => {}
    ```

+ Quy tắc thứ tự các hàm trong React Native
    - Contructor
    - Cycle component function(ComponentDidMount, unmount...)
    - Hàm phụ (getData, calculator...)
    - Hàm callback (onPress....)
    - Render phụ (renderItem, renderFooter...)
    - Render chính
   
+ Quy tắc số lượng: 
    - Hạn chế tối đa số dòng code ko cần thiết
    - Một hàm không nên quá 50 dòng
    - Một class không nên vượt quá 500 dòng (Hàm dài thì nên tách ra thành những hàm con)
    - Một hàm không được vượt quá 5 tham số, nên giữ <= 3. Nếu cần nhiều hơn thì có thể dùng tham số dạng object thay thế
    - Một hàm chỉ nên làm duy nhất 1 việc
    - Các block lồng nhau tối đa 4 cấp

+ Quy tắc commment
    - Không nên comment quá nhiều trong 1 hàm
    - Mỗi đoạn comment sẽ cách đoạn code bên trên 1 dòng
    - Những hàm xử lý phức tạp thì bắt buộc phải comment logic hướng xử lý

+ Quy tắc về import file, thư viện
    - Dùng phím tắt Shift + Alt + O để vscode tự động sắp xếp, remove unuse lib

+ Quy tắc viết style trong React Native
    - Đặt tên của style phải rõ nghĩa cho component

+ Một số quy tắc khác
    - Thay toán tử điều kiện cho câu lệnh if-else ngắn VD
    ```
    var b = null;
    if (a === 2){
        b = 4;
    } else {
        b = 5;
    }
    ```
    Thay bằng 
    ```
    var b = a === 2 ? 4 : 5;
    ```
    - Loại bỏ block không cần thiết VD
    ```
    var process(){
        if (a === 4) {
            ...Code 1...
            ...Code 2...
        } 
    }
    ```
    Thay bằng
    ```
        var process(){
            if (a != 4) return;
            ...Code 1...
            ...Code 2...
        }
    ```
    Còn cập nhật...
+ Quy tắc đặt tên ảnh, asset
    - Tên file ảnh trong resource sẽ đặt tên bằng chữ thường, ko dấu, các từ cách nhau bởi dấu _ (Nếu ko đúng sẽ bị lỗi khi build Android)

# Snip code
+ Định nghĩa: google
+ Snipcode nên dùng: Trong file Visualcode_dg.code-snippets
+ Cách sử dụng
    - Vào VSCode -> Preference -> User Snip -> New Global Snipcode file(Tạo một file mới)
    - Copy toàn bộ nội dung file Visualcode_dg.code-snippets và parse vào file mới đó
    - Sử dụng
        + Gõ tắt colog -> console.log('')
        + flog -> Funcs.log('...')
        + fori -> for (int i=0; i<n; i++)
        + afunc -> arrow function
