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

  # ----- EXPERIENCE | EDUCATION + PUBLISHED WORK (two columns) -----
  # Custom block: layouts/_partials/hbx/blocks/cv-columns/block.html
  # Publications and presentations: data/published_work.yaml
  - block: cv-columns
    id: experience
    content:
      username: me
      max_publications: 0 # 0 = all; set e.g. 5 to show "Recent Published Work" + link to the CV
      publications_id: publications
      bibtex_url: uploads/dawley.bib
    design:
      date_format: 'Jan 2006'
      spacing:
        padding: ['3rem', '0', '3rem', '0']

  # ----- PROJECTS & SOFTWARE -----
  - block: focus-areas
    id: projects
    content:
      title: Projects & Software
      text: Research code from the Princeton work is not public yet; each card says what the code does and what it changed.
      items:
        - name: Many-body simulation engine
          description: Monte Carlo and molecular dynamics for stealthy hyperuniform and related disordered systems. C/C++ with OpenMP and SIMD vectorization, CUDA kernels for the GPU path, and a JAX implementation for differentiable experiments. Runs on multi-GPU SLURM clusters and produced the data behind the *Phys. Rev. E* paper.
          icon: hero/cpu-chip
          gradient: from-blue-600 to-indigo-700
          topics:
            - C/C++ · OpenMP · SIMD
            - CUDA
            - JAX
        - name: Bootstrap uncertainty quantification
          description: A resampling pipeline that estimates relaxation times, with confidence intervals, from noisy simulation time series. Cut the data that had to be stored and the runtime by orders of magnitude while reproducing the original estimates exactly, and exposed estimator bias and sampling artifacts in earlier analyses.
          icon: hero/chart-bar
          gradient: from-emerald-600 to-teal-700
          topics:
            - Bootstrap
            - Time series
            - Estimator bias
        - name: GPU mutual-information estimators
          description: JAX implementations of mutual-information estimators for detecting directional dependence in stochastic trajectories. Scales to hundreds of gigabytes of trajectory data on a single node.
          icon: hero/presentation-chart-line
          gradient: from-violet-600 to-purple-700
          topics:
            - JAX
            - Information theory
            - Stochastic trajectories
        - name: Learning potentials from structure
          description: PyTorch benchmark of neural operators, diffusion models, and equivariant graph networks for the inverse problem of inferring pair potentials from structural data. Hundreds of tracked GPU runs (Weights & Biases) across architectures and data regimes.
          icon: hero/sparkles
          gradient: from-rose-600 to-pink-700
          topics:
            - PyTorch
            - Neural operators
            - Diffusion · GNNs
        - name: nics-aroma
          description: Open-source Python package implementing the nucleus-independent chemical shift (NICS) method for quantifying aromaticity and electron delocalization from Gaussian16 output. Built during undergraduate work with the Tovar group at Johns Hopkins.
          icon: brands/github
          gradient: from-amber-600 to-orange-700
          url: https://github.com/sdawley1/nics-aroma
          topics:
            - Python
            - Gaussian16
            - Open source
          cta:
            text: View on GitHub
            url: https://github.com/sdawley1/nics-aroma
    design:
      layout: cards
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
