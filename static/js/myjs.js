//flash message dissmissble
$('.message .close')
    .on('click', function() {
        $(this)
            .closest('.message')
            .transition('fade');
    });

//hover effect on index page
let elements = document.querySelectorAll(".hover");
for (let element of elements) {
    element.addEventListener("mouseover", () => {
        element.classList.add("shadow-lg");
    });
}

for (let element of elements) {
    element.addEventListener("mouseout", () => {
        element.classList.remove("shadow-lg");
    });
}

//scroll behaviour
$('.navbar-brand').click(function() {
    $('html').css("scrollBehavior", "smooth");
});

// to prevent image overload when adding images
const addImageBtn = document.querySelector('.add-images');
if (addImageBtn) {
    const imageInput = document.getElementById('image');
    const fileLabel = document.querySelector('.custom-file-label');
    addImageBtn.onclick = (event) => {
        if (imageInput && imageInput.files.length > 3) {
            event.preventDefault();
            fileLabel.classList.add('invalid-text');
            fileLabel.innerText = "Maximum of 3 images only!!";
        }
    }
}