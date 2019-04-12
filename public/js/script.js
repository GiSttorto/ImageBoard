(function() {

    Vue.component('getimage', {

        template: "#algumaimagem",
        props: ["id"],
        data: function() {
            return {
                image: {
                    title: '',
                    username: '',
                    description: '',
                    url: '',
                    created_at: ''
                },
                form: {
                    comment: '',
                    otherUser: '',
                    created_at: '',
                    id: ''
                },
                comments: []
            }
        },

        watch: {
            imageId: function() {
                console.log('this.imageId:', this.imageId);
            var self = this;
            axios
                .get("/get-image/" + this.imageId)
                .then(function(resp) {
                 console.log('resp:', resp);
                 self.title = resp.data[0].title;
                 self.description = resp.data[0].description;
                 self.url = resp.data[0].url;
                 self.username = resp.data[0].username;
                });
            }
        },

        methods: {
            exit: function(e) {
              this.$emit('close');
          },
            imageId: function(e) {
               this.$emit('id');
           },

           createComment: function(e) {
               e.preventDefault();
               // console.log("test");
               // console.log("events: ", e);
               // console.log("this: ", this);
               let self = this;
               // console.log("this.imageId: ", this.image.id);
               // console.log("self.form: ", self.form);
               axios
                    .post("/create-comment/" + this.image.id, self.form)
                    .then(function(resp) {
                        self.comments.unshift(resp.data.rows[0]);
                    })
                    .catch(function(err) {
                        // console.log("error: ", err);
                    });

                }
       },


        mounted: function() {
            let self = this
            // console.log("this.image: ", this.image);
            axios.get('/get-image/' + this.id)
            .then(function(response){
                // console.log("this: ", this);
                // console.log("self.image: ", self.image);
                self.image = response.data;
                // console.log("response: ", response.data);
            }).then(function() {
                    axios
                        .get("/get-comment/" + self.image.id)
                        .then(function(response) {
                            self.comments = response.data;
                        });
            }).catch(function(err){
                console.log("error get-image/:id: ", err);
            })

      }
  });

    new Vue({
        el: "#main",

        data: {
            images: [],
            form: {
                title: '',
                username: '',
                description: '',
                file: null
            },
            // greatee: "World",
            // message: "It is good to see you",
            imageId: location.hash.slice(1) ||  null

        }, //end data

        mounted: function() {
           var self = this;

           window.addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);

            });

           axios.get("/images")
               .then(function(resp) {
                   // console.log("axios");
                   self.images = resp.data;
                   // console.log("images", self.images);
               })
               .catch(function(err) {
                   console.log("error", err);
               });
           //make a request to get info here
       },

        methods: {

            moreImg: function() {
              var self = this;
              // console.log("self: ", self);
              var lastId = this.images[this.images.length - 1].id;
              // console.log("lastId script: ", lastId);

              if (lastId == 0) {
                  self.moreImg = false;
                  console.log("self.morePics", self.more);
              }

              axios.get("/more-img/" + lastId)
                .then(function(resp) {
                    self.images.push.apply(self.images, resp.data);
                });
          },

            openImage: function(e) {
                // console.log("events: ", e);
                this.imageId = e;
                // console.log("this: ", this.imageId);
            },

            handleFileChange: function(e) {
                // console.log('handleFileChange running!!');
                // console.log('e in handleFileChange: ', e);
                this.form.file = e.target.files[0]
                // console.log("this: ", this);
            },


            uploadFile: function(e) {
                // call preventDefault to tell button not reload the page - argument e
                // console.log('uploadFile running!!');
                e.preventDefault()
                var formData = new FormData;
                // FormData is just ofr files
                // if we don't have file we don't need it
                formData.append('file', this.form.file)
                formData.append('title', this.form.title)
                formData.append('description', this.form.description)
                formData.append('username', this.form.username)
                // console.log('formData: ', formData);

                axios.post('/upload', formData).then(response => {
                    this.images.unshift(response.data[0]);
                }).catch(err => {
                    console.log("error: ", err);
                })

                // console.log("this in uploadFile", this);
                // console.log("this.description in uploadFile", this.form.description);
            },

        }


    })// end new Vue
})(); // end function
