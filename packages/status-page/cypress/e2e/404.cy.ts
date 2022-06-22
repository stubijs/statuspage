describe('a11y', () => {
  describe('dark theme', () => {
    it('should be accessible', () => {
      cy.visit('http://localhost:3000/404/', {
        onBeforeLoad(win) {
          // @ts-expect-error: matchMedia exists
          cy.stub(win, 'matchMedia')
            .withArgs('(prefers-color-scheme: dark)')
            .returns({
              matches: true,
            })
        },
      })
      testA11y()
    })
  })

  describe('light theme', () => {
    it('should be accessible', () => {
      cy.visit('http://localhost:3000/404/', {
        onBeforeLoad(win) {
          // @ts-expect-error: matchMedia exists
          cy.stub(win, 'matchMedia')
            .withArgs('(prefers-color-scheme: dark)')
            .returns({
              matches: false,
            })
        },
      })
      testA11y()
    })
  })
})

function testA11y() {
  cy.injectAxe()
  ;[
    [1920, 1080],
    'macbook-15',
    'macbook-13',
    'macbook-11',
    'iphone-6',
    'iphone-6+',
    'ipad-mini',
  ].forEach((size) => {
    if (Cypress._.isArray(size))
      cy.viewport(size[0], size[1])

    else
      cy.viewport(size as Cypress.ViewportPreset)

    cy.wait(200)
    cy.checkA11y(null, {
      includedImpacts: ['serious'],
    })
  })
}

export {}
