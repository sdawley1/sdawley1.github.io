---
title: "Research Intern" # Title
place: "Platform for the Accelerated Realization, Analysis, and Discovery of Interface Materials"
PI: "Dr. David Elbert, Dr. Tyrel McQueen & Dr. Apurva Mehta"
times: "June 2022 - August 2022"
#
include_header: true
collection: teaching
type: "Dr. David Elbert, Dr. Tyrel McQueen, & Dr. Apurva Mehta" # PIs 
permalink: /teaching/paradim
venue: "Platform for the Accelerated Realization, Analysis, and Discovery of Interface Materials" # Location
date: 2022-06-01
readable_date: "Summer 2022" # DATE ON THE INDIVIDUAL RESEARCH PAGE
location: "Baltimore, MD"
excerpt: "Studied and developed new methods for advancing real-time data analysis through automatic signal structure and phase change detection with **Dr. David Elbert** and **Dr. Tyrel McQueen**."
---

<!-- [[Poster](https://www.paradim.org/sites/default/files/2022-08/Dawley%20poster%202022.pdf), [Presentation](https://vod.video.cornell.edu/media/2022%20REU%20Presentation%3A%20Sam%20Dawley/1_2dq36xvl), [Report](https://www.paradim.org/sites/default/files/2022-08/Dawley%20final%20report%202022.pdf)]  -->

The Platform for the Accelerated Realization, Analysis, and Discovery of Interface Materials ([PARADIM](https://www.paradim.org/)) is an NSF-funded materials innovation platform intended to help create and design new interface materials for use in the next generation of electronic devices. With Dr. Elbert and the [McQueen Lab](https://occamy.chemistry.jhu.edu/) at Hopkins I studied methods for on-the-fly data analysis as a means of accelerating the materials discovery process and ultimately designing strategies for autonomous discovery. In particular, my research focused on extracting information from noisy signals (e.g., X-ray diffraction patterns) to elucidate the structure and onset of phase changes, i.e., spectral peaks. The crux of the algorithm, written in Python, relies on testing for common coefficients of variation across adjacent partitions of the data.

A full research report, poster, and recording of my presentation can be found on the [PARADIM website](https://www.paradim.org/reu_participants), under my name. Below are a list of some of my primary accomplishments while working there:

- Development and programmatic implementation of an algorithm for automatic peak detection; utilizes statistical analysis and partitioning of local variation within noisy signals and spectra to determine the onset of phase changes.
- Creation of Python program for live-streaming data directly from collection instrument. Streaming done using Apache Kafka and cloud-based storage.
- Collaboration with scientists at the SLAC National Accelerator Laboratory for applying machine learning methods to develop methods of signal extraction from noisy signals. The data shared between groups includes both one-dimensional and two-dimensional diffraction patterns, the latter collected from the Stanford Synchrotron Radiation Lightsource at SLAC, allowing for greater generalization of analysis tools and application.

<div class="centerfig">
  <figure>
    <img src="../files/example_partitioning.png" alt="Partitioned diffraction pattern" style="float: center; width: 500px;" />
    <div class="centercaption" style="width: 500px"><em>
    Partitioning of an X-ray diffraction pattern for analysis.
    </em></div>
  </figure>
</div>
