document.addEventListener('DOMContentLoaded', function () {

    const confirmationButtons = document.querySelectorAll('.minimalism-button[require-confirmation="true"]');

    confirmationButtons.forEach(button => {
        let clickState = 0;
        let isTransitioning = false;

        button.addEventListener('click', function (event) {
            event.preventDefault();

            if (isTransitioning) {
                return;
            }

            if (clickState === 0) {
                button.classList.remove('initial-state');
                button.classList.add('transparent-bg');
                button.classList.add('half-filled');
                clickState = 1;
            } else if (clickState === 1) {
                button.classList.remove('half-filled');
                button.classList.add('fully-filled');
                clickState = 2;
                isTransitioning = true;

                setTimeout(function () {
                    returnToInitialState(button);

                    // const transitionEndHandler = function () {
                    //     button.removeEventListener('transitionend', transitionEndHandler);
                    //     button.classList.remove('transparent-bg');
                    //     isTransitioning = false;
                    //
                    //     const confirmedEvent = new CustomEvent('confirmation-complete', {
                    //         bubbles: true,
                    //         detail: { button: button }
                    //     });
                    //     button.dispatchEvent(confirmedEvent);
                    // };
                    //
                    // button.addEventListener('transitionend', transitionEndHandler);

                    setTimeout(function () {
                        isTransitioning = false;
                        const confirmedEvent = new CustomEvent('confirmation-complete', {
                            bubbles: true,
                            detail: {button: button}
                        });
                        button.dispatchEvent(confirmedEvent);
                    }, 800);

                }, 700);
            }
        });

        document.addEventListener('click', function (event) {
            if (clickState === 1 && !button.contains(event.target)) {
                returnToInitialState(button);
            }
        });

        function returnToInitialState(button) {
            button.classList.remove('half-filled');
            button.classList.remove('fully-filled');
            button.classList.add('initial-state');
            clickState = 0;
            setTimeout(function () {
                button.classList.remove('transparent-bg');
            }, 700)
        }

    });
});



function addOnButtonClickListener(button, listener) {
    const requireConfirmation = button.getAttribute('require-confirmation') === 'true';
    if (requireConfirmation) {
        button.addEventListener('confirmation-complete', listener);
    } else {
        button.addEventListener('click', listener);
    }
}