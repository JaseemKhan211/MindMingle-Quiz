import swal from 'sweetalert2';

export const WaitingAlert =  () => {
    swal.fire({
        title: 'Please Wait!',
        text: 'The admin has not raised a question yet. Please wait...',
        icon: 'info',
        showConfirmButton: true
    });
}

export const YourSuccess = () => {
    Swal.fire({
        icon: "success",
        title: "The question has been raised successfully! 🎉"
    });
}

export const myError = () => {
    swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>'
    });
}

// Check for hidden alert trigger
document.addEventListener('DOMContentLoaded', () => {
    const waitingAlert = document.getElementById('waiting-alert');
    if (waitingAlert) WaitingAlert();
});