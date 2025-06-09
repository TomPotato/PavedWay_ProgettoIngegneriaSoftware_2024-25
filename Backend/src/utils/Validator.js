class Validator {
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    validateName(name) {
        const nameRegex = /^[a-zA-ZÀ-ÿ' -]{2,}$/u;
        return nameRegex.test(name);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]).{8,}$/;
        return passwordRegex.test(password);
    }

    validateDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
        const dateRegex2 = /^\d{4}-\d{2}-\d{2}/;

        return dateRegex.test(date) || dateRegex2.test(date);
    }

    validateComment(comment) {
        const commentRegex = /^[\w\s.,!?'"()\-:;@&$%#*+=/\\]{1,200}$/;
        return commentRegex.test(comment);
    }

    validateRadius(radius) {
        return (radius <= 5000 && radius > 0 && typeof (radius) === 'number');
    }

    validateLocation(latitude, longitude) {
    return (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        latitude >= -90 && latitude <= 90 &&
        longitude >= -180 && longitude <= 180
    );}

    validateNotification(notification) {
        const notificationRegex = /^[a-zA-ZÀ-ÿ0-9.,:;!?()'"“”‘’\- ]{1,100}$/;
        return notificationRegex.test(notification);
    }

    validateStatus(status) {
        const validStatuses = ['pending', 'approved', 'rejected', 'solved'];
        return validStatuses.includes(status);
    }
}

module.exports = new Validator();