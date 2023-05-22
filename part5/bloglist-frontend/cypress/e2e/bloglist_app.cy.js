describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'tester',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('tester')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })
    it('fails with incorrect credentials', function() {
      cy.get('#username').type('tester')
      cy.get('#password').type('incorrect')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'incorrect username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'secret' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('A New Blog')
      cy.get('#author').type('Blogger McBlogface')
      cy.get('#url').type('http://blog.blog.blog')
      cy.get('#blog-submit-button').click()

      cy.contains('a new blog A New Blog successfully added')
      cy.contains('A New Blog Blogger McBlogface')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'A New Blog',
          author: 'Blogger McBlogface',
          url: 'http://blog.blog.blog'
        })
      })

      it('User can like a blog', function() {
        cy.contains('A New Blog Blogger McBlogface')
          .contains('view')
          .click()

        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('User who created a blog can delete it', function() {
        cy.contains('A New Blog Blogger McBlogface')
          .contains('view')
          .click()

        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'A New Blog Blogger McBlogface')
      })

      it('Another user who did NOT create the blog cannot see the delete button', function() {
        // Create second user and login
        const user = {
          name: 'Second User',
          username: 'seconduser',
          password: 'secondsecret'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.login({ username: 'seconduser', password: 'secondsecret' })

        cy.contains('Second User logged in')
        cy.contains('A New Blog Blogger McBlogface')
          .contains('view')
          .click()

        cy.contains('remove').should('not.exist')
      })
    })

    describe('and many blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'Second Most Liked',
          url: 'http://blog.SecondMost.liked'
        })
        cy.createBlog({
          title: 'The title with the third most likes',
          author: 'Third Most Liked',
          url: 'http://blog.SecondMost.liked'
        })
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'Most Liked',
          url: 'http://blog.most.liked'
        })
      })

      it('blogs are correctly ordered by most to least likes', function() {
        // Like first blog twice
        cy.contains('The title with the most likes')
          .contains('view')
          .click()
        cy.contains('likes 0')
          .find('.like-button')
          .click()
        cy.contains('likes 1')
          .find('.like-button')
          .click()
        cy.contains('likes 2')

        // Like second blog once
        cy.contains('The title with the second most likes')
          .contains('view')
          .click()
        cy.contains('likes 0')
          .find('.like-button')
          .click()
        cy.contains('likes 1')

        cy.visit('http://localhost:3000')
        cy.contains('The title with the most likes')
          .contains('view')
          .click()
        cy.contains('The title with the second most likes')
          .contains('view')
          .click()
        cy.contains('The title with the third most likes')
          .contains('view')
          .click()

        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'The title with the third most likes')
      })
    })
  })
})
