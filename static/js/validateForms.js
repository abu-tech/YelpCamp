$('.ui.form').form({
    fields: {
        title: {
            identifier: "campground[title]",
            rules: [{
                type: "empty",
                prompt: "Please Enter The Title"
            }]
        },
        location: {
            identifier: "campground[location]",
            rules: [{
                type: "empty",
                prompt: "Please Enter Location"
            }]
        },
        img: {
            identifier: "campground[img]",
            rules: [{
                type: "empty",
                prompt: "Please Enter a Image Url"
            }]
        },
        price: {
            identifier: "campground[price]",
            rules: [{
                type: "empty",
                prompt: "Please Enter Price"
            }]
        },
        description: {
            identifier: "campground[description]",
            rules: [{
                type: "empty",
                prompt: "Please Enter The Breif Description"
            }]
        },
        body: {
            identifier: "review[body]",
            rules: [{
                type: "empty",
                prompt: "Can't Submit The Empty Review",
            }]
        },
        username: {
            identifier: "username",
            rules: [{
                type: "empty",
                prompt: "Enter the username"
            }]
        },
        email: {
            identifier: "email",
            rules: [{
                type: 'email',
                prompt: 'Please enter a valid email'
            }]
        },
        password: {
            identifier: "password",
            rules: [{
                type: "empty",
                prompt: "Enter the password"
            }, {
                type: 'minLength[6]',
                prompt: 'Your password must be at least {ruleValue} characters!'
            }]
        }
    }
});