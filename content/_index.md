---
title: 'Home'
date: 2023-10-24
type: landing

sections:
  # ----- BIOGRAPHY -----
  - block: biography
    content:
      username: me
      # Show a call-to-action button under your biography? (optional)
      # button:
      #   text: Download Résumé
      #   url: uploads/resume.pdf
    design:
      show_status: false
      spacing:
        padding: ['0', '0', '6rem', '0']
      banner:
        # Upload your cover image to the `assets/media/` folder and reference it here
        filename: kalen-emsley-Bkci_8qcdvQ-unsplash.jpg
      biography:
        # Customize the style of your biography text
        style: 'text-align: center; font-size: 0.8em;'
      # Avatar customization
      avatar:
        size: large # Options: small (150px), medium (200px, default), large (320px), xl (400px), xxl (500px)
        shape: rounded # Options: circle (default), square, rounded

  # ----- EXPERIENCE -----
  - block: experience
    content:
      username: me
    design:
      # Hugo date format
      date_format: 'January 2006'
      # Education or Experience section first?
      is_education_first: true
  # - block: skills
  #   content:
  #     title: Skills & Hobbies
  #     username: me
  # - block: awards
  #   content:
  #     title: Awards
  #     username: me
---
