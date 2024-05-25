![landing](<Screenshot 2024-04-30 215956.png>)

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
- [:toolbox: Setup Instructions](#toolbox-setup-instructions)
- [:ledger: Colab Notebooks](#ledger-colab-notebooks)
- [:brain: Models](#brain-models)
- [:scroll: Important References](#scroll-important-references)
- [:trophy: Milestones](#trophy-acknowledgements)
- [:trophy: Acknowledgements](#trophy-acknowledgements)
- [:writing_hand: Cite our Project](#writing_hand-cite-our-project)

## :book: About

**STELLA.ai** is an intelligent system that automatically segments brain lesions using the uploaded CT scan. We harness the power of computer vision and machine learning to extract the brain lesion segmentation points of stroke, whether it's an ischemic or hemorrhagic type of stroke. We built this application from the ground up to an actual implementation in a usable desktop application.

We're strategizing to train two models to align with the system's goals: the U-Net model and Mask RCNN. Given the available datasets, adjustments will be made to the U-Net model to optimize its performance due to differing dimensions. On the other hand, the Mask RCNN has achieved an impressive 80% Intersection over Union (IoU) accuracy in segmenting brain lesions.

In classifying strokes, we're utilizing the Hounsfield Scale, a linear transformation of the original linear attenuation coefficient measurement. Here, the radiodensity of distilled water at standard pressure and temperature (STP) is set as 0 Hounsfield units (HU), while air at STP is defined as -1000 HU. This approach aids in determining the density value of lesion tissue by calculating the mean of the segmented area through the summation of all pixel values.

![202405172144-ezgif com-video-to-gif-converter](https://github.com/qarudafxz/stella-ai_frontend/assets/70809588/9da7053f-b5df-4a9b-9328-a1022c9a1fc1)

## :toolbox: Setup Instructions

👉 Go to [/src](/src) for detailed instructions on how to setup this project on your machine.

Source Repositories:

1. `🎨` [stella-desktop](https://github.com/qarudafxz/stella-ai_frontend/blob/main/README.md)
2. `⚡` [stella-api-v1_U-Net_CNN Api - Back End Repo] Not available to public
3. `⚡` [stella-api-v2_Mask RCNN Api - Back End Repo] Not available to public

## 📦 Supporting Repositories

1. [Dataset Preprocessing for the model](https://github.com/qarudafxz/stella-ai_preprocessing)

## :ledger: Colab Notebooks

1. [U-Net CNN Training (First Version) Not available to public]
2. [Mask RCNN Training (Second Version) Not available to public]

## :brain: Models

- [work_in_progress](https://media.licdn.com/dms/image/C4E12AQE98dfpdYhxZA/article-cover_image-shrink_600_2000/0/1610116669577?e=2147483647&v=beta&t=8DlUsQtrkOc3ihFpCvEsEfboPv-MrW46YmPFwgtpB9I)

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

1. STELLA.ai was selected as one of the top 10 teams competing in the Hack4Health Hackathon organized by the Department of Health, Philippines, partnered with the Development Academy of the Philippines on May 15-17, 2024
2. STELLA.ai won as 3rd Place in the Hack4Health Hackathon
3. Ms. Angel Mutia declared STELLA.ai as a novel position because there are one (1) to no similar solutions that match STELLA.ai, which is ready for a patent.
4. STELLA.ai defended its paper with accepted and minor revisions.

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

<br />
2024 © Bete & Tin-ao (BSIT) - Caraga State University - College of Computing and Information Sciences. All Rights Reserved.
