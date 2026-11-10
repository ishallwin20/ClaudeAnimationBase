#!/bin/sh
# alive_score_cut.sh: lay Lyria take 2 (assets/alive_score_take2.mp3) on the reel's TL. The take's own times: the launch
# hit 22.5, flight to 36.3, the quiet wonder 36.3-42.9, anger 42.9-50, silence 50-52.7, the drop 52.75.
# The reel's: the leap 26.2, the Himalaya 33, he rises 43.5, the tear 50.8. So: the opening slowed 14% to reach the
# leap; 7.5 s of flight; the wonder slowed to fill 33.7-43.2; the anger; most of a second of nothing; the drop.
S=assets/alive_score_take2.mp3
ffmpeg -y -v error -i $S -filter_complex "
[0:a]atrim=0:22.5,asetpts=PTS-STARTPTS,atempo=0.8588[a];
[0:a]atrim=22.5:30.2,asetpts=PTS-STARTPTS[b];
[0:a]atrim=36.2:42.9,asetpts=PTS-STARTPTS,atempo=0.7[c];
[0:a]atrim=42.9:50.2,asetpts=PTS-STARTPTS,afade=t=out:st=7.0:d=0.3[d];
[0:a]atrim=52.7:87,asetpts=PTS-STARTPTS[e];
anullsrc=r=48000:cl=stereo,atrim=0:0.8[z];
[a][b]acrossfade=d=0.02:c1=tri:c2=tri[ab];
[ab][c]acrossfade=d=0.6:c1=tri:c2=tri[abc];
[abc][d]acrossfade=d=0.3:c1=tri:c2=tri[abcd];
[abcd]aresample=48000[q];[z]aresample=48000[z2];[e]aresample=48000[e2];
[q][z2][e2]concat=n=3:v=0:a=1[o]" -map "[o]" -ar 48000 -ac 2 assets/alive_score.wav
