# US Federal Funding Cuts Visualisation

## Background 

President Donald Trump's administration has not frozen all federal programs. The freeze primarily targets specific areas such as foreign aid, diversity, equity, and inclusion (DEI) initiatives, and environmental projects. On January 27, 2025, the Office of Management and Budget (OMB) issued a memorandum directing federal agencies to temporarily pause activities related to the obligation or disbursement of federal financial assistance in these targeted areas. 

The OMB identified approximately 2,600 federal programs for review under this directive. However, essential programs that provide direct benefits to Americans, such as Social Security, Medicare, Medicaid, SNAP, Pell Grants, and Head Start, were explicitly exempted from the freeze. 

While the freeze affects a significant number of programs, it does not encompass all federal programs. The targeted programs represent a portion of federal initiatives, with critical services and benefits to individuals remaining unaffected. 

## Main Idea

The idea is to it shifts the focus from individual programs to thematic funding distribution within each department. Instead of looking at just programs, we would highlight key themes/topics (words) that receive funding across multiple programs. This makes it easier to identify funding priorities and patterns within each department.

## Workflow

1. Extract the dataset from a txt file scrapped from the web, using a python script. Save as a *.csv file.
2. Data preparation in a notebook using python and scikit-learn. Export the data in JSON, which is an appropriate format to use in D3.js.
3. Data visualization using D3.js. Question: Where will the data be stored? Will a potential (sparse) matrix be small enough to be uploaded to GitHub?
