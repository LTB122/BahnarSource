# BARTViBa - Bahnar Machine Translation Service

A Python-based machine translation service using BART model for Vietnamese-Bahnar translation.

## Overview

BARTViBa is a machine translation service that provides translation capabilities between Vietnamese and Bahnar languages. It uses a fine-tuned BART model for high-quality translations.

## Training

There are multiple models for this project. Use different trainer file and modify configuration for training:

- bert2bert:
```bash
python trainer/custom_bert2bert_trainer.py
```

- marianmt:
```bash
python trainer/custom_marianmt_trainer.py
```

- bartpho:
```bash
python trainer/custom_bartpho_trainer.py
```

There is also a colab file at `trainer_notebook.ipynb` guiding training process.

## Inference

### Checkpoint Model
The current best model is aligned_bartpho model. The checkpoint is stored at: [Link]

### Running the Service

1. First: Start VNCoreNLP server:
```bash
vncorenlp -Xmx2g "BARTViBa/GraphTranslation/vncorenlp/VnCoreNLP-1.1.1.jar" -p 9000 -a "wseg,pos,ner,parse"
```
The VnCoreNLP JAR file is located in the `BARTViBa/GraphTranslation/vncorenlp/` directory relative to your project root.

2. Then: Start API server on port 10000:
```bash
python app.py
```

### Model Types
- BART
- BART_CHUNK
- BART_CHUNK_NER_ONLY

## Corpus Area

For each area (Binh Dinh, Gia Lai, Kon Tum), there is a specific corpus data corresponding to that area.

### Data Structure

Each area folder contains:

#### Dictionary Files
- `dict.ba`
- `dict.vi`

#### Parallel Corpus Files
- `train.vi`/`train.ba`
- `valid.vi`/`valid.ba`
- `test.vi`/`test.ba`

### Overall Folder Structure

```
📦data
 ┣ 📂all
 ┃ ┣ 📜dict.ba
 ┃ ┣ 📜dict.vi
 ┃ ┣ 📜norm_kriem.ba
 ┃ ┣ 📜norm_kriem.vi
 ┃ ┣ 📜test.ba
 ┃ ┣ 📜test.vi
 ┃ ┣ 📜train.ba
 ┃ ┣ 📜train.vi
 ┃ ┣ 📜valid.ba
 ┃ ┗ 📜valid.vi
 ┣ 📂BinhDinh
 ┃ ┣ 📂dictionary
 ┃ ┃ ┣ 📜dict.ba
 ┃ ┃ ┣ 📜dict.vi
 ┃ ┃ ┗ 📜vi-ba_word_dict_norm.json
 ┃ ┗ 📂parallel_corpus
 ┃ ┃ ┣ 📜test.ba
 ┃ ┃ ┣ 📜test.vi
 ┃ ┃ ┣ 📜train.ba
 ┃ ┃ ┣ 📜train.vi
 ┃ ┃ ┣ 📜valid.ba
 ┃ ┃ ┗ 📜valid.vi
 ┣ 📂cache
 ┃ ┗ 📜graph.json
 ┣ 📂GiaLai
 ┃ ┣ 📂dictionary
 ┃ ┃ ┣ 📜dict.ba
 ┃ ┃ ┣ 📜dict.vi
 ┃ ┃ ┗ 📜vi-ba_word_dict_norm.json
 ┃ ┗ 📂parallel_corpus
 ┃ ┃ ┣ 📜test.ba
 ┃ ┃ ┣ 📜test.vi
 ┃ ┃ ┣ 📜train.ba
 ┃ ┃ ┣ 📜train.vi
 ┃ ┃ ┣ 📜valid.ba
 ┃ ┃ ┗ 📜valid.vi
 ┣ 📂KonTum
 ┃ ┣ 📂dictionary
 ┃ ┃ ┣ 📜dict.ba
 ┃ ┃ ┣ 📜dict.vi
 ┃ ┃ ┗ 📜vi-ba_word_dict_norm.json
 ┃ ┗ 📂parallel_corpus
 ┃ ┃ ┣ 📜test.ba
 ┃ ┃ ┣ 📜test.vi
 ┃ ┃ ┣ 📜train.ba
 ┃ ┃ ┣ 📜train.vi
 ┃ ┃ ┣ 📜valid.ba
 ┃ ┃ ┗ 📜valid.vi
 ┣ 📂synonyms
 ┃ ┣ 📜convert.py
 ┃ ┣ 📜vi_syn_data.json
 ┃ ┗ 📜vi_syn_data_1.json
 ┣ 📜newWord.py
 ┗ 📜vi-ba_word_dict_norm.json
```

## License

[Add your license information here]
