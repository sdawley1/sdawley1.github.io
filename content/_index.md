---
title: 'Sam Dawley'
date: 2026-10-15
type: landing

sections:
  # ----- BIOGRAPHY -----
  - block: resume-biography
    id: about
    content:
      username: me
      button:
        text: Download résumé (1 page)
        url: uploads/Dawley_Resume.pdf
    design:
      show_status: false
      spacing:
        padding: ['3rem', '0', '3rem', '0']
      biography:
        style: 'text-align: left; font-size: 1rem;'
      avatar:
        size: large
        shape: circle

  # ----- RESEARCH AREAS -----
  - block: focus-areas
    id: research
    content:
      title: Research
      text: Three threads run through my work, from thesis theory to the code and statistics that make it quantitative.
      items:
        - name: Inverse statistical mechanics
          description: Designing interactions that stabilize prescribed structures. Hyperuniform and stealthy disordered ground states, relaxation of nonequilibrium initial conditions to equilibrium, and the structure-to-interaction inverse problem.
          icon: hero/cube-transparent
          topics:
            - Hyperuniformity
            - Stealthy ground states
            - Relaxation dynamics
            - Pair statistics
            - Inverse problems
        - name: Scientific computing at scale
          description: Custom Monte Carlo and molecular dynamics engines for many-body systems, parallelized with OpenMP, SIMD, and CUDA, run on multi-GPU clusters. GPU estimators that process hundreds of gigabytes of trajectory data.
          icon: hero/cpu-chip
          topics:
            - C/C++ · CUDA · JAX
            - Monte Carlo · MD
            - HPC workflows
            - Performance engineering
        - name: Statistical inference and machine learning
          description: Bootstrap uncertainty quantification for noisy time series, estimator-bias diagnosis, mutual-information estimation, and deep-learning models (neural operators, diffusion models, equivariant GNNs) for inferring potentials from structure.
          icon: hero/chart-bar
          topics:
            - Uncertainty quantification
            - Time-series analysis
            - Mutual information
            - PyTorch · JAX
            - Generative models
    design:
      layout: cards
      spacing:
        padding: ['3rem', '0', '3rem', '0']

  # ----- EXPERIENCE + EDUCATION -----
  - block: resume-experience
    id: experience
    content:
      username: me
    design:
      date_format: 'Jan 2006'
      is_education_first: false
      spacing:
        padding: ['3rem', '0', '3rem', '0']

  # ----- PUBLICATIONS & PRESENTATIONS -----
  - block: markdown
    id: publications
    content:
      title: Publications & Presentations
      text: |
        #### Publications

        1. **S. J. Dawley** and S. Torquato. Quantification of the relaxation of nonequilibrium initial conditions of many-particle systems to their equilibrium states. *In preparation* (2026).
        2. **S. J. Dawley** and S. Torquato. Evolution of various initial many-particle configurations to disordered stealthy hyperuniform ground states. [*Phys. Rev. E* **112**, 045310 (2025)](https://doi.org/10.1103/9wbz-h7t4).
        3. N. B. Vilas, C. Hallas, L. Anderegg, P. Robichaud, C. Zhang, **S. Dawley**, L. Cheng, and J. M. Doyle. Blackbody thermalization and vibrational lifetimes of trapped polyatomic molecules. [*Phys. Rev. A* **107**, 062802 (2023)](https://doi.org/10.1103/PhysRevA.107.062802).

        [Download BibTeX](uploads/dawley.bib) · [ORCID 0009-0005-6234-476X](https://orcid.org/0009-0005-6234-476X)

        #### Presentations

        1. **S. J. Dawley** and S. Torquato. "Evolution of various initial many-particle configurations to disordered stealthy hyperuniform ground states." Princeton Materials Institute Symposium, Princeton, NJ (2025).
        2. **S. J. Dawley**, C. Zhang, X. Zheng, and L. Cheng. "Blackbody thermalization and vibrational lifetimes of trapped polyatomic molecules." Talk, ACS Spring National Meeting, Indianapolis, IN (2023).
        3. **S. J. Dawley**, D. Elbert, T. McQueen, and A. Mehta. "Streaming by design for materials characterization." Talk, Cornell University, Ithaca, NY (2022).
    design:
      spacing:
        padding: ['3rem', '0', '3rem', '0']

  # ----- PROJECTS & SOFTWARE -----
  - block: markdown
    id: projects
    content:
      title: Projects & Software
      text: |
        Research code from the Princeton work is not public yet; the summaries below describe what each piece does and what it changed.

        {{< cards cols="1" >}}
        {{< card title="Many-body simulation engine" icon="hero/cpu-chip" subtitle="Monte Carlo and molecular dynamics for stealthy hyperuniform and related disordered systems. C/C++ with OpenMP and SIMD vectorization, CUDA kernels for the GPU path, and a JAX implementation for differentiable experiments. Runs on multi-GPU SLURM clusters and produced the data behind the *Phys. Rev. E* paper." >}}
        {{< card title="Bootstrap uncertainty quantification for relaxation times" icon="hero/chart-bar" subtitle="A resampling pipeline that estimates relaxation times, with confidence intervals, from noisy simulation time series. Reduced the data that had to be stored and the runtime by orders of magnitude while reproducing the original estimates exactly, and exposed estimator bias and sampling artifacts in earlier analyses." >}}
        {{< card title="GPU mutual-information estimators" icon="hero/presentation-chart-line" subtitle="JAX implementations of mutual-information estimators for detecting directional dependence in stochastic trajectories. Scales to hundreds of gigabytes of trajectory data on a single node." >}}
        {{< card title="Learning interaction potentials from structure" icon="hero/sparkles" subtitle="PyTorch benchmark of neural operators, diffusion models, and equivariant graph networks for the inverse problem of inferring pair potentials from structural data. Hundreds of tracked GPU runs (Weights & Biases) across architectures and data regimes." >}}
        {{< card title="nics-aroma" icon="brands/github" url="https://github.com/sdawley1/nics-aroma" subtitle="Open-source Python package implementing the nucleus-independent chemical shift (NICS) method for quantifying aromaticity and electron delocalization from Gaussian16 output. Built during undergraduate work with the Tovar group at Johns Hopkins." >}}
        {{< /cards >}}
    design:
      spacing:
        padding: ['3rem', '0', '3rem', '0']

  # ----- SKILLS -----
  - block: resume-skills
    id: skills
    content:
      title: Technical Skills
      username: me
    design:
      spacing:
        padding: ['3rem', '0', '3rem', '0']

  # ----- TEACHING & MENTORING -----
  - block: markdown
    id: teaching
    content:
      title: Teaching & Mentoring
      text: |
        **Teaching Assistant, Princeton University** (Fall 2025)
        - *Statistical Mechanics* (graduate): equilibrium and nonequilibrium thermodynamics, classical and quantum statistics, critical phenomena, and computational techniques.
        - *Software Engineering for Scientific Computing* (graduate): writing portable, robust code for high-performance computing environments.
        - *Calculus I* (undergraduate).

        **Teaching Assistant, Johns Hopkins University** (2022–2023)
        - *Computational Molecular Medicine* (graduate): machine learning, statistical inference, and multiple hypothesis testing for high-dimensional biological data.
        - *Organic Chemistry I & II* and the introductory and intermediate organic chemistry laboratories.

        **Head PILOT Leader, Johns Hopkins University** (2020–2023)
        - Organized and led weekly peer-led team-learning sessions in multivariable calculus and organic chemistry; co-wrote the problem sets and answer keys used by the whole course with the instructor; ran midterm and final review sessions.
        - Private tutor in linear algebra, multivariable calculus, organic chemistry, and physical chemistry; first-year mentor for an incoming cohort (2020–2021).
    design:
      spacing:
        padding: ['3rem', '0', '3rem', '0']

  # ----- HONORS -----
  - block: resume-awards
    id: honors
    content:
      title: Honors
      username: me
    design:
      spacing:
        padding: ['3rem', '0', '4rem', '0']
---
