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
  })
})