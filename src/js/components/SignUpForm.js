import MultiForm from './MultiForm';


class SignUpForm extends MultiForm {
    
    constructor(selector) {
        
        super(selector);
        
        this.pictureInput = this.get('form').elements['profile-picture-input'];

        this.picturePreview = this.pictureInput.parentElement.querySelector('.preview');
        
        this.pictureInput.addEventListener('change', (e) => this.pictureUpload(e));

    }

    pictureUpload(e) {

        while(this.picturePreview.firstChild) {
            this.picturePreview.removeChild(this.picturePreview.firstChild);
        }
        
        let files = e.target.files;

        for (let i = 0; i < files.length; i++) {

            const file = files[i];
            
            if (!file.type.startsWith('image/')){ continue }
            
            const img = document.createElement("img");

            img.classList.add("obj");

            img.src = URL.createObjectURL(file);

            img.onload = function() {
                URL.revokeObjectURL(this.src);
            }
        
            this.picturePreview.appendChild(img);

        }
    }

}

export default SignUpForm;