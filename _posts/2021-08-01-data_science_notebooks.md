---
title: "Chemical and Materials Science Data Analysis Tools"
collection: posts
type: "type" # PIs
permalink: /year-archive/2021-08-01-data_science_notebooks/
venue: "Venue" # FULL LOCATION
date: 2021-08-01
location: "Location"
excerpt: "Some data science projects I did for a class."
header:
    teaser: "../files/sunscreen_graph.png"
---

I took a data science class one semester and coded a few tools for analyzing chemical and materials data. Below are some of those notebooks, mainly my favorites. These are also interesting because it was at the time I was just learning Python, so some of the code/algorithms are funny to read.

* **[UV/Vis Curve Fitting](https://nbviewer.org/github/sdawley1/UV-Vis-Curve-Fitting/blob/main/sdawley1_hw5.ipynb)**
    is a python notebook that analyzes absorption data collected from samples containing unknown proportions of vesicles, miscelles, and water. The ultimate goal is to determine the proportion of vesicles, miscelles, water in each sample using curve fitting and some methods from optimization. The corresponding github repo links to a JACS paper which the code is based on.
* **[Sunscreen Visualization](https://nbviewer.org/github/sdawley1/Sunscreen-Visualization/blob/main/sdawley1_hw7.ipynb)**
    contains a ton of different sunscreens which were tested for efficacy. Interestingly, the data presented here was collected by a class of first-year undergraduates, hence the reason some of the absorption spectra are more realistic than others.
* **[Heat Capacity Modeling](https://nbviewer.org/github/sdawley1/Heat-Capacity-Modeling/blob/main/sdawley1_hw6.ipynb)**
    It's been said that if there was matter so rare we could only make a single measurement on it, that measurement should be the heat capacity. There are two competing methods of heat capacity modeling, the Debye model and the Einstein model. While different, both models estimate specific situations very well, and therefore it is common to fit heat capacity data to a linear combination of the models.
* **[Kinetic Equilibrium Modeling](https://nbviewer.org/github/sdawley1/Kinetic-Equilibrium-Model/blob/main/sdawley1_hw4.ipynb)**
    Chemical kinetics is great for determining how long a reaction will take, unlike thermodynamics which tells us only about how favorable a reaction is. This notebook models equilibrium concentrations of the Haber-Bosch process, the process responsible for artificial nitrogen fixation. The main process involves establishing and solving an initial value problem, with known rate constants and initial concentrations.

