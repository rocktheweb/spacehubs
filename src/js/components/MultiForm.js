const _NODES = new WeakMap();

const CLASS_NAMES = {
    formIndicator   : '.multiform-indicator',
    formContent     : '.multiform-tabs',
    formStep        : '.multiform-tab',
    formNav         : '.multiform-nav'

};


if (!Math.easeInOutQuad ) {
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };
}

const scrollTo = (final, scrollDuration) => {

    let start = window.scrollY || document.documentElement.scrollTo,
        currentTime = null;
    
    const animateScroll = function(timestamp) {
        
        if (!currentTime) currentTime = timestamp;
        
        let progress = timestamp - currentTime;
        
        if (progress > scrollDuration) progress = scrollDuration;
        
        let val = Math.easeInOutQuad(progress, start, final-start, scrollDuration);
        
        window.scrollTo(0, val);

        if (progress < scrollDuration) {
            window.requestAnimationFrame(animateScroll);
        }
    };

    window.requestAnimationFrame(animateScroll);
}

class MultiForm {

    constructor(selector) {

        _NODES.set(this, this._getNodes(selector));

        this.currentIndex = 0;
        
        this._bindClickEvent();

        this._setActiveStep(this.currentIndex);

        window.addEventListener('resize', () => this._setFormHeight(this.currentIndex));
    }
    

    get(nodeType) {

        const nodes = _NODES.get(this);

        if (typeof nodeType === 'string' && nodeType in nodes ) {
            return nodes[nodeType];
        }

        return nodes;
    }

    _getNodes(selector) {
        
        let form,
            indicators,
            content,
            steps,
            navigation,
            length;

        if (typeof selector === 'string') {
    
            let elem = document.querySelector(selector);
    
            if (!elem) throw new Error('Cannot find HTML Element');
    
            form = elem;
    
        } else if (typeof selector === 'object' && selector instanceof Element) {
    
            form = selector;
        }
        
        indicators = [...form.querySelectorAll(CLASS_NAMES.formIndicator)];
        content = form.querySelector(CLASS_NAMES.formContent);
        steps = [...form.querySelectorAll(CLASS_NAMES.formStep)];
        navigation = form.querySelector(CLASS_NAMES.formNav);
        length = steps.length;

        return {
            form,
            indicators,
            content,
            steps,
            navigation,
            length
        }
    }
    
    _bindClickEvent() {

        const { navigation, length } = this.get();
        
        navigation.addEventListener('click', (e) => {

            if (!(e.target.nodeName === 'BUTTON')) return;
            
            switch (e.target.dataset.value) {
                
                case 'prev':
                   
                    if (this.currentIndex === 0) {
                        
                        return;

                    } else {

                        this._setActiveStep(--this.currentIndex);
                    }

                    break;
                
                case 'skip':
                    
                    if (this.currentIndex === length - 1) {
                        
                        return;

                    } else {

                        this._setActiveStep(++this.currentIndex);
                    }

                    break;

                case 'next':
                   
                    if (this.currentIndex === length - 1) {
                        
                        return;

                    } else {

                        this._setActiveStep(++this.currentIndex);
                    }

                    break;

                default: 
                break;
            }

        });
    }

    _setActiveStep(index) {

        const { steps, indicators } = this.get();
        
        steps.forEach(step => {
            step.classList.remove('active');
        });

        steps[index].classList.add('active');

        indicators.forEach((indicator, i) => {
            index >= i ? indicator.classList.add('active') : indicator.classList.remove('active'); 
        });
        
        this._setFormHeight(index);
        this._updateNav(index);
        
        scrollTo(0, 1000);

    }
    
    

    _setFormHeight(index) {

        const { steps, content } = this.get();

        const activeStepHeight = steps[index].offsetHeight;

        content.style.height = `${activeStepHeight}px`;

    }
    
    _updateNav(index) {

        const { steps, navigation, length } = this.get();
        
        const currentStep = steps[index];

        const prevBtn = navigation.querySelector('[data-value="prev"]');
        const nextBtn = navigation.querySelector('[data-value="next"]');
        const skipBtn = navigation.querySelector('[data-value="skip"]');
        
        if ( index > 0 && index < length - 1 ) {

            nextBtn.textContent = 'next step';
            nextBtn.setAttribute('type', 'button');
            skipBtn.setAttribute('type', 'button');
            prevBtn.classList.remove('hide');

        } else if ( index === length - 1 ) {
            
            setTimeout(() => {
                nextBtn.setAttribute('type', 'submit');
                skipBtn.setAttribute('type', 'submit');
            }, 100);

            nextBtn.textContent = 'finish';

        } else {

            nextBtn.textContent = 'sign up';
            prevBtn.classList.add('hide');

        }

        if (currentStep.dataset.skippable) {
            
            skipBtn.classList.remove('hide');
        
        } else {

            skipBtn.classList.add('hide');
        }
    }
}

export default MultiForm;