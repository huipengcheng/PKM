---
tags: 🧠️/⚙️
aliases:
  - Flows
cssclass: null
created: 2022-06-01 22-15
updated: 2022-06-01 22-15
---

# Workflows

---

%%
```mermaid
graph TD;

	% Inputs
	A[Articles]
	C[Research Papers]
	D[Podcasts]
	E[Videos]
	F[Digital Books]
	G[Physical Books]

	subgraph " "
		A-->B[raindrop.io]
		B-->M1[Read & file items]
	end

	M1-->L6

	subgraph " "
		F-->L1
		C-->L1[Gather papers <br>in zotero]
		L1-->L2[give good meta <br>data tags]
		L2-->L3[read & markup]
		L3-->L4[extract with <br>zotfile]
		L4-->L5[run md note on <br>extracted notes]
	end

	L5-->L6[put lit notes <br>into obsidian using <br>lit note templates]

	subgraph " "
		D-->N0{Listening <br>on the go?}
		N0--Y-->NN[grab Airr quotes]
		NN-->NN0[Caption them <br>with thoughts]
		NN0-->NN1[Export <br>to Markdown <br>with transcript]
		NN1-->NN2[Airdrop <br>to computer]
		NN2-->NN3{only a <br>single quote?}
		NN3--Y-->NNN1[use Airr <br>page template]
		NN3--N-->NNN2[put quotes and <br>links into podcast <br>template, no embedd]
		N0--N-->N1[put podcast player <br>into obsidian note]
		N1-->N2[2 copies of note open <br>listen and noteate]
	end

	NNN1-->L6
	NNN2-->L6
	N2-->L6

	subgraph " "
		E-->O1[watch and notate <br>with Memex]
		O1-->O2[Extract notes<br>To plain text]
	end

	O2-->L6

	subgraph " "
		G-->P{Kindle or Physical?}
		P--Physical-->P1[read and hand <br>write notes]
		P--Kindle-->P3[Read and notate<br>With Kindle]
		P3-->P4{Lengthy<br>or<br>Complex?}
		P4--Y-->P1
		P1-->P2{Lengthy <br>or<br> Complex?}
		P2--Y-->Q1[Transcribe <br>each chapter]
		P2--N-->Q2[Transcribe <br>whole batch]
	end

	P4--N-->L6
	Q1-->L6
	Q2-->L6

	% The final obsidian note generation workflow:
	L6-->L7[Lit notes into seedbox]
	L7-->L8[Review lit notes <br>and generate seedlings]
	L8-->L9[Incubate seedlings <br>with thought <br>and linking]
	L9-->L10>Plant seedlings <br>into Evergreen forest]

	% Class Definitions
	classDef inputs fill: #427b58, stroke: #689d6a, stroke-width: 4px
		class A,C,D,E,F,G inputs
	classDef tools fill: #af3a03, stroke: #fe8019, stroke-width: 4px
		class B,L1,NN,O1,P3 tools
	classDef obsidian fill: #8f3f71, stroke: #d3869b, stroke-width: 4px
		class L6,L7,L8,L9,L10 obsidian
	classDef decisions fill: #9d0006, stroke: #fb4934, stroke-width: 4px
		class N0,NN3,P,P4,P2 decisions

```
%%



![[2021-10-24 14-25-12.excalidraw]]
