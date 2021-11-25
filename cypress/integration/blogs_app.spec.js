describe("Blogs App", function() {

  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    cy.request("POST", "http://localhost:3003/api/users", {
      username: "tester",
      password: "test123"
    })
    cy.visit("http://localhost:3000")

  })

  it("(17) Login form is shown", function() {
    cy.get("#username")
    cy.get("#password")
  })

  describe("Login", function() {

    beforeEach(function() {
      cy.logout()
      cy.visit("http://localhost:3000")
    })

    it("(18) Succeeds with correct credentials", function() {
      cy.get("#username").type("tester")
      cy.get("#password").type("test123")
      cy.contains("login").click()
    })

    it("(18) Fails with wrong credentials", function() {
      cy.get("#username").type("wronguser")
      cy.get("#password").type("wrongpwd")
      cy.contains("login").click()
      cy.get(".toast").should("have.css", "border-color", "rgb(255, 0, 0)")
    })
  })

  describe("When logged in", function() {

    beforeEach(function() {
      cy.logout()
      cy.visit("http://localhost:3000/")
      cy.login({ username: "tester", password: "test123" })
    })

    it("(19) A blog can be created", function() {
      cy.get("#togglable-toggler").click()
      cy.get("#title").type("Mickeys Blog")
      cy.get("#author").type("Mickey")
      cy.get("#url").type("https://mikaelpetersen.se/")
      cy.get("#add-new-blog").click()
    })

    it("(20) A user can like a blog", function() {
      cy.get("#togglable-toggler").click()
      cy.get("#title").type("Mickeys Blog")
      cy.get("#author").type("Mickey")
      cy.get("#url").type("https://mikaelpetersen.se/")
      cy.get("#add-new-blog").click()
      cy.contains("Show").click()
      cy.contains("Like").click()
    })

    it("(21) A user can delete their own a blog", function() {
      cy.get("#togglable-toggler").click()
      cy.get("#title").type("Mickeys Blog")
      cy.get("#author").type("Mickey")
      cy.get("#url").type("https://mikaelpetersen.se/")
      cy.get("#add-new-blog").click()
      cy.contains("Show").click()
      cy.contains("Delete").click()
      cy.on('window:confirm', (str) => {
            expect(str).contains("Do you really want to remove")
        })
      cy.on('window:confirm', () => true)
    })

    it("(21) Another user cannot delete someone elses blog", function() {
      // Add blog
      cy.get("#togglable-toggler").click()
      cy.get("#title").type("Mickeys Blog")
      cy.get("#author").type("Mickey")
      cy.get("#url").type("https://mikaelpetersen.se/")
      cy.get("#add-new-blog").click()

      // Set up second user
      cy.request("POST", "http://localhost:3003/api/users", {
        username: "testerTwo",
        password: "test123"
      })
      cy.logout()
      cy.login({ username: "testerTwo", password: "test123" })

      cy.contains("Show").click()
      cy.get("button:last").contains("Like")
    })

    it("(22) Blogs are ordered according to likes ", function() {

      const user = JSON.parse(window.localStorage.getItem("loggedBlogappUser"))

      cy.request({
        method: "POST",
        url: "http://localhost:3003/api/blogs",
        headers: {
          "Authorization": `bearer ${user.token}`
        },
        body: {
          title: "One",
          author: "One",
          url: "One",
          likes: 100,
          user: "test"
        }
      })

      cy.request({
        method: "POST",
        url: "http://localhost:3003/api/blogs",
        headers: {
          "Authorization": `bearer ${user.token}`
        },
        body: {
          title: "Five",
          author: "Five",
          url: "Five",
          likes: 500,
          user: "test"
        }
      })

      cy.request({
        method: "POST",
        url: "http://localhost:3003/api/blogs",
        headers: {
          "Authorization": `bearer ${user.token}`
        },
        body: {
          title: "Three",
          author: "Three",
          url: "Three",
          likes: 300,
          user: "test"
        }
      })

      cy.request({
        method: "POST",
        url: "http://localhost:3003/api/blogs",
        headers: {
          "Authorization": `bearer ${user.token}`
        },
        body: {
          title: "Two",
          author: "Two",
          url: "Two",
          likes: 200,
          user: "test"
        }
      })

      cy.reload()

      cy.get(".show-button").then((showbuttons) => {
        showbuttons.click()
      })
      cy.get(".like").then((likes) => {
        likes.each((i, like) => {
          if (i < (likes.length - 1)) {
            let value = parseInt(like.innerHTML)
            let nextValue = parseInt(likes[i + 1].innerHTML)
            cy.wrap(value).should("be.gt", nextValue)
          }
        })
      })
    })

  })
})


// cy.login({ username: "root", password: "sekret" })
