# US Federal Funding Cuts Visualisation

## Main Idea

The idea is to it shifts the focus from individual programs to thematic funding distribution within each department. Instead of looking at just programs, we would highlight key themes/topics (words) that receive funding across multiple programs. This makes it easier to identify funding priorities and patterns within each department.

## Workflow

1. Extract the dataset from a txt file scrapped from the web, using a python script. Save as a *.csv file.
2. Data preparation in a notebook using python and scikit-learn. Export the data in JSON, which is an appropriate format to use in D3.js.
3. Data visualization using D3.js. Question: Where will the data be stored? Will a potential (sparse) matrix be small enough to be uploaded to GitHub?
