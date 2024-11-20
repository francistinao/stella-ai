![landing](</extra/Screenshot 2024-04-30 215956.png>)

<h3 align="center">🧠 STELLA.ai (Stroke Tomography for Enhanced Lesion Learning Analysis) v1.0 🧠</h3>
<p align="center">
  Automated Stroke Detection using Computer Vision and U-Net CNN Model
</p>
<p align="center">
  <!-- <a href="https://github.com/sindresorhus/awesome"> -->
    <img alt="Awesome Badge" src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg" height="20">
  <!-- </a> -->
  </a>
</p>

## 📖 Summary

This repository serves as the main documentation for our undergraduate study for Caraga State University - Main Campus, titled: **_"STELLA.ai:
Smart Brain CT Scan Screening System for Automated Stroke Detection Using Computer Vision and U-Net Model"_**

In this repo, you can:

- [x] Have an idea about the system.
- [x] Read the manuscript.

## 📑 Contents

- [:book: About](#book-about)
- [:ledger: Colab/Jupyter Notebooks](#ledger-colab-notebooks)
- [:brain: Models](#brain-models)
- [:scroll: Important References](#scroll-important-references)
- [:trophy: Milestones](#trophy-acknowledgements)
- [:trophy: Acknowledgements](#trophy-acknowledgements)
- [:writing_hand: Cite our Study](#writing_hand-cite-our-project)

## :book: About

**STELLA.ai** is an intelligent system that automatically segments brain lesions using the uploaded CT scan. We harness the power of computer vision and machine learning to extract the brain lesion segmentation points of stroke, whether it's an ischemic or hemorrhagic type of stroke. We built this application from the ground up to an actual implementation in a usable desktop application.

We're strategizing to train two models to align with the system's goals: the U-Net model and Mask RCNN. Given the available datasets, adjustments will be made to the U-Net model to optimize its performance due to differing dimensions. On the other hand, the Mask RCNN has achieved an impressive 80% Intersection over Union (IoU) accuracy in segmenting brain lesions.

In classifying strokes, we're utilizing the Hounsfield Scale, a linear transformation of the original linear attenuation coefficient measurement. Here, the radiodensity of distilled water at standard pressure and temperature (STP) is set as 0 Hounsfield units (HU), while air at STP is defined as -1000 HU. This approach aids in determining the density value of lesion tissue by calculating the mean of the segmented area through the summation of all pixel values.

![202405172144-ezgif com-video-to-gif-converter](https://github.com/qarudafxz/stella-ai_frontend/assets/70809588/9da7053f-b5df-4a9b-9328-a1022c9a1fc1)

## What's New? STELLA.ai v1.1

 **Lesion 3D Viewer**
![alt text](<extra/NEW FEAT.gif>)

 **3D Lesion Viewer**

![3D Lesion Viewer](</extra/3d_lesion_viewer.gif>)

STELLA.ai now features an advanced 3D Lesion Viewer, powered by Three.js, which transforms the AI-detected lesions into interactive 3D models. This cutting-edge feature allows for a more comprehensive and intuitive analysis of stroke lesions.

Key features of the 3D Lesion Viewer include:

- **360° Inspection**: Users can rotate and zoom the 3D model, enabling a thorough examination from all angles.
- **Wireframe View**: Toggle a wireframe overlay to visualize the mesh structure of the lesion.
- **Axis Visualization**: Clearly marked X, Y, and Z axes help orient the lesion in 3D space.
- **Lesion Metrics**: 
  - Total surface area of the lesion is calculated and displayed.
  - Severity assessment based on the lesion's size and location.
- **Interactive Controls**: User-friendly interface for manipulating the 3D view and accessing different visualization modes.

This feature significantly enhances the ability of medical professionals to understand the spatial characteristics of stroke lesions, potentially leading to more accurate diagnoses and treatment plans.

 **STELLAmulator Beta**

![alt text](<extra/2024-08-17 20-42-39 (1).gif>)

STELLAmulator (Stroke Tomography for Enhanced Lesion Learning Analysis Simulator) is an advanced tool tailored for Radiologic Technologist students. It offers an interactive and efficient learning experience in stroke identification and classification.

Students are challenged to identify strokes by marking lesions on Brain CT Scans and classifying the stroke type. Their performance is then evaluated by STELLA's AI model, providing feedback on the accuracy of their stroke identification and classification.

## Features Work In Progress

- ML Model Retraining (with higher hyperparameters observed, e.g., epochs, batches, etc.)
- MRI Viewer (3D Viewer)
- In-app communication with certified radiologists in the area (via WiFi or SMS)
- Secure API Requests with Hexadecimal Hashing and Caching to Prevent Endpoint Breaches

## 📦 Source Repositories:

1. `🎨` [stella-desktop](https://github.com/qarudafxz/stella-ai_frontend/blob/main/README.md)
2. `⚡` [stella-api-v1_U-Net_CNN Api - Back End Repo] Not available to public
3. `⚡` [stella-api-v2_Mask RCNN Api - Back End Repo] Not available to public

## 📦 Supporting Repositories

1. [Dataset Preprocessing for the model](https://github.com/qarudafxz/stella-ai_preprocessing)

## :ledger: Colab Notebooks

1. [U-Net CNN Training (First Version) Not available to public]
2. [Mask RCNN Training (Second Version) Not available to public]

## :brain: Models

- [U-Net](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYhWHL4PVGdeAlmpNcgYR9YtlNXj8dZxUCeg&s)
- [MaskRCNN](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYhWHL4PVGdeAlmpNcgYR9YtlNXj8dZxUCeg&s)

## :scroll: Important References

- Any Paper that uses Brain CT Scans must cite the following:

```bibtex
Ischemic Stroke Datasets:

@inproceedings{liang2021SymmetryEnhancedAN,
	title={Symmetry-Enhanced Attention Network for Acute Ischemic Infarct Segmentation with Non-Contrast CT Images},    
	author={Kongming Liang, Kai Han, Xiuli Li, Xiaoqing Cheng, Yiming Li, Yizhou Wang, and Yizhou Yu},    
	booktitle={MICCAI},    
	year={2021}    
}

Hemorraghic Stroke Datasets:
@article{journalofneurologyresearch2022,
  title = {Case Report},
  author = {},
  journal = {Journal of Neurology Research},
  volume = {12},
  number = {3},
  pages = {128--131},
  year = {2022},
  month = {October},
  issn = {1923-2845 (print), 1923-2853 (online)},
  url = {https://www.neurores.org},
  publisher = {Elmer Press Inc},
  note = {Open Access},
}
```

- Our `📄 Thesis Manuscript` are available on [/doc](https://media.licdn.com/dms/image/C4E12AQE98dfpdYhxZA/article-cover_image-shrink_600_2000/0/1610116669577?e=2147483647&v=beta&t=8DlUsQtrkOc3ihFpCvEsEfboPv-MrW46YmPFwgtpB9I).

## :trophy: Acknowledgements

| Name                                                                                        | Contributions                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [👨‍🏫 James Earl D. Cubillas, MSc.](https://scholar.google.com.ph/citations?user=mxdcIF0AAAAJ&hl=en) | Our ever-supportive Thesis Adviser.                                                                  
| 👩‍⚕️ Dra. Sheen C. Urquiza                                                                    | For her expertise in neuro-radiology.                                                                       
| 👨‍🏫 Ms. Angel G. Mutia (WIPO)                                                                | For her assistance in IP Rights and Novelty Related.
| 👨‍🏫 Dr. Gabriel Borlongan                                                                    | For sharing his available information on the status of radiology, finalizing the systems' potential revenue model, and distribution channels.
| 👨‍🏫 Mr. Kenneth Quijalvo                                                                     | For defining the best protocol to be implemented.


## 🏆 Milestones

1. STELLA.ai was selected as one of the top 10 teams competing in the Hack4Health Hackathon organized by the Department of Health, Philippines, partnered with the Development Academy of the Philippines on May 15-17, 2024. [check](https://www.facebook.com/photo?fbid=122133789746240452&set=a.122121805382240452)
2. STELLA.ai won as 3rd Place in the Hack4Health Hackathon. [check](https://www.facebook.com/photo?fbid=122138744636240452&set=pcb.122138745014240452)
3. STELLA.ai won as 2nd Place in Alliance Medical Innovation Challenge (AMIC) 2024 Hackathon. [check](https://devpost.com/software/stella-ai-rsjn4i)
4. STELLA.ai made it to the top 10 innovations in BEEPEEAI-DEEOWWESTEE IA 2024. [check](https://www.facebook.com/photo/?fbid=497735315967371&set=pcb.497741139300122)
5. STELLA.ai was selected as part of the top 20 innovations and won as Champion in CSU Innovation Challenge 2024. [check](https://www.facebook.com/photo/?fbid=122160831242151434&set=pcb.122160832712151434)
6. STELLA.ai won as Champion in DICT's Philippine Start Up Challenge 9 2024 Regional Pitching Competition. [check](https://www.facebook.com/DICTCaraga/posts/pfbid0xTuX66U8Dm3Xi4wVN37QdRtABYQYw77T1kD59s9MXGCCUJBB8BNLpnMZvjJRTA3ql)
7. STELLA.ai was selected as part of the top 10 finalists for the NSTW Startup Jam Pitching Competition 2024. [check](https://www.facebook.com/photo/?fbid=551904894462081&set=a.112464658406109)

## :writing_hand: Cite Our Study

```bibtex
  @article{article,
  type={Bachelor's Thesis},
  author = {Bete, Rhea and Tin-ao, Francis},
  title = {STELLA.ai (Stroke Tomography for Enhanced Lesion Learning Analysis): Smart Brain CT Scan Screening System for Automated Stroke Detection using CV and U-Net CNN},
  journal = {Caraga State University College of Computing and Information Sciences},
  address = {Ampayon, Butuan City, Philippines},
  year = {2024}
}
```

## License

See the [LICENSE](https://github.com/francistinao/stella-ai/blob/main/LICENSE.md) file for licensing information.

## Demo

STELLA v1.1 is available for demonstration. If you wish to try, email @ _francisjtinao@gmail.com_

<br />
2024 © Bete & Tin-ao (BSIT) - Caraga State University - College of Computing and Information Sciences. All Rights Reserved.
