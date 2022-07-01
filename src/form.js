(function () {
    firebase.initializeApp({
        projectId: 'batizado-casamento',
        databaseURL: "https://batizado-casamento.firebaseio.com"
    });
    var db = firebase.firestore();


    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById('dedicatoriaFormSubmitBtn').addEventListener('click', function (event) {
            submit(event);
        });

        document.getElementById('dedicatoriaModal').addEventListener('shown.bs.modal', function () {
            document.getElementById('dedicatoriaFormSubmitBtn').disabled = false;
            document.getElementById('dedicatoriaFormAlertSuccess').style.display = 'none';
        });
    });

    function submit(event) {
        event.preventDefault();
        event.stopPropagation();

        let form = document.getElementById('dedicatoriaForm');
        if (form.checkValidity() === true) {
            document.getElementById('dedicatoriaFormSubmitBtn').disabled = true;

            //get values
            const name = document.getElementById('dedicatoriaAssign').value;
            const message = document.getElementById('dedicatoriaText').value;

            sendMessageForm(name, message);

            // Show alert
            document.getElementById('dedicatoriaFormAlertSuccess').style.display = 'block';
            // // Hide alert after 3 seconds
            setTimeout(function(){
                let dedicatoriaModal = bootstrap.Modal.getInstance(document.querySelector('#dedicatoriaModal'));
                dedicatoriaModal.hide();
            }, 3000);

        } else {
            form.classList.add('was-validated');
        }
    }

    function sendMessageForm(
        name,
        message
    ) {
        db.collection("messages").add({
            name: name,
            message: message
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
})();