# A US Federal Funding Cuts Visualisation

## Background 

On January 27, 2025, the Office of Management and Budget (OMB) issued a memorandum directing federal agencies to temporarily pause activities related to the obligation or disbursement of federal financial assistance in targeted areas such as foreign aid, diversity, equity, and inclusion (DEI) initiatives, and environmental projects. 

The OMB identified approximately 2,600 federal programs for review under this directive. While the freeze affects a significant number of programs, it does not encompass all federal programs. The targeted programs represent a portion of federal initiatives. 

## Aim

The aim of this project is to create a visualization that will shifts the focus from individual programs to thematic funding distribution within each department. Instead of looking at just programs, it highlights key themes/topics (words) that receive funding across multiple programs. This makes it easier to identify funding priorities and patterns within each department.

## Workflow

1. Extract the dataset from a txt file scrapped from the web, using a python script. Save as a *.csv file.
2. Data preparation in a notebook using python and scikit-learn. Export the data in JSON - an appropriate format to use in D3.js.
3. Data visualization using D3.js.

## Project Structure

project-root  
│── data-preparation  # Python scripts for data processing  
│── data              # Raw and processed data files  
│── web-app           # Frontend code (HTML, CSS, JS)  
│── README.md         # Documentation  
│── requirements.txt  # Dependencies 

