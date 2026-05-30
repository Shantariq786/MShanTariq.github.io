---
title: "Research"
description: "An overview of nonlinear partial differential equations, where they arise, and why Discontinuous Galerkin methods are powerful tools for studying them."
math: true
---

My research lies at the intersection of nonlinear dispersive PDEs, structure-preserving numerical methods, and scientific computing. This page gives both a conceptual overview of the area and a more direct summary of the problems I have worked on, the methods I have developed, and the directions I want to pursue next.

{{< research-overview >}}

## Nonlinear Partial Differential Equations

Nonlinear partial differential equations, or nonlinear PDEs, are equations involving unknown functions of several variables together with their derivatives, where the dependence on the function or its derivatives is not purely linear. In practice, this means the system can generate rich behaviors such as wave interaction, steep gradients, dispersion, shocks, instability, pattern formation, and multi-scale dynamics.

These equations appear throughout science and engineering because many real systems are inherently nonlinear. Small changes do not always lead to small responses, and different physical effects can couple together in complicated ways.

## Where They Appear

Nonlinear PDEs arise in many important settings:

- Fluid dynamics, where they describe the transport and interaction of momentum, pressure, and waves
- Water waves and shallow-wave theory, including models such as the Korteweg-de Vries equation
- Materials and continuum mechanics, where deformation and stability can depend nonlinearly on state variables
- Biological and chemical systems, where diffusion, transport, and reaction mechanisms interact
- Atmospheric and geophysical modeling, where transport, rotation, and dissipation operate across large scales

For my own work, nonlinear PDEs are especially important in wave propagation, dispersive systems, and scientific computing for mathematically structured models.

## Why Nonlinear PDEs Matter

Nonlinear PDEs are central because they often capture the real structure of physical systems better than simplified linear models. They are also mathematically challenging. Exact solutions are rare, and even when a model is well posed, its numerical approximation must be designed carefully to preserve stability, accuracy, and physically meaningful behavior.

This is why numerical methods are not just computational tools; they are part of the scientific understanding of the problem itself.

## What Makes Them Challenging

Several features make nonlinear PDEs difficult to analyze and simulate:

- Nonlinear interaction between terms can amplify or suppress solution features
- Sharp structures may form even from smooth initial data
- Multiple time and length scales can coexist in the same model
- Conservation, dispersion, or dissipation properties must often be respected numerically
- Long-time integration can magnify small numerical errors

Because of this, robust numerical schemes must balance mathematical structure with computational efficiency.

## What Are Discontinuous Galerkin Methods

Discontinuous Galerkin, or DG, methods are high-order finite element methods in which the numerical solution is approximated locally on each element, while allowing discontinuities across element boundaries. Communication between elements is handled through carefully designed numerical fluxes and interface terms.

DG methods are attractive because they combine several strengths:

- High-order accuracy on complex problems
- Element-local structure that supports efficient computation
- Flexibility for complex geometries and adaptive refinement
- Strong conservation properties when designed appropriately
- Good compatibility with time-stepping methods for evolution equations

In simple terms, DG methods offer a powerful framework for solving PDEs while preserving local control, mathematical flexibility, and high-order approximation quality.

## Why DG Methods Are Useful for Nonlinear PDEs

For nonlinear and dispersive wave equations, DG methods are especially appealing because they can be designed to handle delicate balances between transport, nonlinearity, and higher-order derivative terms. This matters for models where stability and structure preservation are not optional.

Well-designed DG formulations can help:

- capture nonlinear wave evolution accurately
- control numerical oscillations near steep features
- preserve important invariants or conservation behavior
- support higher-order temporal discretizations
- reduce computational cost through local element-based structure

These advantages make DG methods a strong choice for modern computational research in nonlinear PDEs.

## A Basic DG Formulation

At a basic level, the DG method starts by dividing the computational domain into small non-overlapping elements. In one space dimension, we write the domain as a union of cells

\[
\Omega = \bigcup_j I_j, \qquad I_j = \left[x_{j-\frac12},\, x_{j+\frac12}\right].
\]

Instead of approximating the solution with one global polynomial, DG uses a separate local polynomial on each element. For a model problem such as

\[
u_t + f(u)_x = 0,
\]

we seek an approximation \(u_h\) such that, on each element \(I_j\),

\[
u_h(x,t)\big|_{I_j} = \sum_{m=0}^{k} U_j^{(m)}(t)\,\phi_m(x),
\]

where the basis functions \(\phi_m\) are usually chosen from the polynomial space \(P^k(I_j)\). In practice, a very convenient choice is to map each element to the reference interval \([-1,1]\) and use Legendre polynomials there. This gives an orthogonal basis, which simplifies both analysis and computation.

### Weak Form in Words

The main DG idea is to work element by element rather than forcing one global approximation over the whole domain. On each cell, we multiply the PDE by a local test function and integrate over that cell. Then we apply integration by parts so that derivatives are shifted away from the solution and onto the test function. This makes the formulation more stable and more natural for high-order polynomial approximation.

Because the solution is allowed to be discontinuous from one element to the next, the values at the interfaces are not automatically the same. DG handles this by introducing numerical fluxes at element boundaries. These fluxes provide the coupling between neighboring cells and determine how information is exchanged across the mesh.

In practical terms, the method has two parts. Inside each element, we compute local volume integrals using the polynomial approximation. At the edges of each element, we compute interface contributions through numerical fluxes. This combination of local approximation and carefully designed interface terms is what gives DG both flexibility and strong conservation properties.

### Legendre Polynomial Approximation

To build the local approximation, we usually map each physical element \(I_j\) onto the reference interval \([-1,1]\) and write

\[
x = x_j + \frac{h_j}{2}\,\xi, \qquad \xi \in [-1,1],
\]

where \(x_j\) is the element center and \(h_j\) is the element size. On this reference element, the approximate solution is expanded in Legendre polynomials:

\[
u_h(x,t)\big|_{I_j} = \sum_{m=0}^{k} U_j^{(m)}(t)\,L_m(\xi),
\]

where \(L_m(\xi)\) is the Legendre polynomial of degree \(m\). Since Legendre polynomials are orthogonal on \([-1,1]\), they are especially useful for representing the solution efficiently and for simplifying the resulting mass and stiffness matrix calculations.

### How the Integrals Are Computed

All integrals are evaluated element by element. After mapping to the reference interval, a typical volume integral becomes

\[
\int_{I_j} g(x)\, dx
= \frac{h_j}{2}\int_{-1}^{1} g\bigl(x(\xi)\bigr)\, d\xi.
\]

In actual computation, this integral is approximated using numerical quadrature:

\[
\int_{I_j} g(x)\, dx
\approx \frac{h_j}{2}\sum_{q=1}^{N_q} w_q\, g\bigl(x(\xi_q)\bigr),
\]

where \(\xi_q\) are quadrature points and \(w_q\) are the corresponding quadrature weights. For polynomial-based DG methods, Gauss or Gauss-Legendre quadrature is commonly used because it gives high accuracy with relatively few points.

In simple terms, the workflow is:

- approximate the solution locally on each element by a polynomial expansion
- multiply the PDE by local test functions and integrate over each element
- integrate by parts to expose interface terms
- replace physical interface fluxes by numerical fluxes
- evaluate the remaining integrals using quadrature rules on the reference element

For nonlinear dispersive equations, the same philosophy is extended carefully to handle higher-order derivatives, auxiliary variables, and structure-preserving choices. That is the setting in which conservative DG methods become especially important for equations such as the generalized KdV and Hirota-Satsuma KdV systems.

## Why Soliton Solutions Matter

Soliton solutions are important because they reveal one of the most remarkable features of certain nonlinear dispersive PDEs: nonlinear interaction does not necessarily destroy coherent wave structure. Instead, localized waves can interact strongly and still re-emerge with their identities preserved. This makes solitons mathematically significant and physically meaningful.

For equations of KdV type, soliton solutions help us understand the balance between nonlinearity and dispersion. Nonlinearity tends to steepen the wave, while dispersion tends to spread it out. A soliton is the result of these competing effects balancing each other in a stable traveling profile. Studying these solutions gives insight into the structure of the equation itself, the mechanisms behind wave propagation, and the qualitative behavior of more general nonlinear wave models.

They are also important from a numerical point of view. If a numerical method is intended to solve nonlinear dispersive PDEs accurately, it should be able to reproduce key features seen in soliton dynamics, including stable propagation, elastic-type interaction, and correct long-time behavior. This is one reason soliton solutions are such valuable test cases for structure-preserving numerical methods.

In my own work, analytical results for KdV-type equations and numerical research on DG schemes are closely connected. Exact and multi-soliton solutions provide theoretical understanding, while numerical methods are needed to approximate more general problems where exact formulas are not available.

{{< soliton-demo >}}

## My Research Direction

My research is centered on structure-preserving numerical methods for nonlinear dispersive PDEs, especially Discontinuous Galerkin methods for KdV-type equations and related models. Broadly, my work combines analytical understanding, conservative discretization, and efficient computation.

### Foundational Study

At the beginning of my PhD, I built my DG background through a close reading of foundational and recent work, including the review article by [Chi-Wang Shu](https://academicweb.nd.edu/~zxu2/acms60790S15/DG-general-approach.pdf) and related conservative DG work by a former student of my advisor published in [SIAM](https://epubs.siam.org/doi/pdf/10.1137/22M1470827). These papers helped shape my understanding of DG formulations, numerical fluxes, conservation, and high-order discretization strategies for nonlinear PDEs.

### Completed Analytical Work

Before my current numerical work, I completed analytical studies on KdV-type equations, including:

- deriving N-soliton solutions of the KdV equation using the Bäcklund transformation
- deriving analytical solutions of the cylindrical KdV equation using the Bäcklund transformation

This analytical work gave me a strong understanding of nonlinear wave structure and soliton behavior, and it continues to inform my numerical research.

### Completed PhD Work

My PhD research has focused on conservative DG methods for nonlinear wave equations, especially the generalized KdV equation and the coupled Hirota-Satsuma KdV system. A central goal of this work has been to preserve the main invariants of these models, namely mass, energy, and the Hamiltonian, at the discrete level.

For the generalized KdV equation, existing conservative DG methods preserve these invariants, but their numerical fluxes introduce time-derivative terms into the discrete system. That increases computational cost and restricts the time discretizations that can be used naturally. In my work, I introduced a new choice of numerical fluxes that removes the time-derivative term from the discrete formulation. This makes the method more efficient, allows the natural use of higher-order implicit Runge-Kutta methods such as IRK4, and reduces each time step to one nonlinear solve followed by one linear solve.

For the coupled Hirota-Satsuma KdV system, I developed a new conservative DG method that, to the best of my knowledge, is the first of its kind. By carefully designing the numerical traces, the derivative terms are removed while preserving mass, energy, and Hamiltonian at the discrete level. The resulting schemes are designed to achieve strong conservation properties, long-time stability, and optimal convergence behavior.

This part of my PhD work is now complete. We have finished the writing process and submitted the paper to the *Journal of Computational Physics* for publication. A preprint of this work is available in the Preprints section.

### Current and Future Directions

My near-term direction is to extend these ideas to the BBM equation, and my longer-term plan is to study nonlinear Schrodinger-type models, including the nonlinear Schrodinger equation (NLS). I am also interested in exploring how machine learning can be integrated with DG methods and related numerical frameworks. The broader goal is to design numerical methods that remain mathematically faithful, computationally efficient, and useful for more general nonlinear dispersive systems.

Across all of these projects, my goal is not only to compute solutions, but to do so in a way that respects the mathematical structure of the underlying model while remaining accurate, stable, and computationally efficient.
