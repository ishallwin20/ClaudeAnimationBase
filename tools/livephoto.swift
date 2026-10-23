// tools/livephoto.swift: a wallpaper-ready iPhone Live Photo (a HEIC still + a QuickTime movie) from rendered frames.
//   swift tools/livephoto.swift --frames=<dir of PNGs, in order> --still=<png> --key=<frame index> --out=<base path>
//   [--fps=30] [--fade=.3 | --fadeIn=s --fadeOut=s]
// Writes <base>.heic and <base>.mov. Photos pairs them by one identifier (MakerApple key 17 in the still, the QuickTime
// content identifier in the movie). The Lock Screen only plays a pair as a moving wallpaper ("Motion Not Available"
// otherwise) when the movie is as the camera writes it, which Apple doesn't document:
//   - 8-bit HEVC Main (no H.264), its long side at most 1920 px (the still keeps the screen's full size), 30 fps, a
//     key frame each second, no reordered frames, Rec. 709 tags;
//   - a timed-metadata track `com.apple.quicktime.live-photo-info` with the camera's record in every frame;
//   - a track with `still-image-time` (-1) and `live-photo-still-image-transform` (identity) in one sample at the still's
//     frame, in the 600 timescale, at least 0.5 s into the movie (earlier, iOS refuses it).
// The first and last `fade` seconds blend from and into the still, so the motion starts and settles without a jump
// (--fadeIn / --fadeOut set each end; 0 for a clip drawn to start or end on the still itself).
// The metadata layout and the camera's reference bytes are LivePaper's measurements on an iPhone
// (github.com/Yuyang16Z/LivePaper, MIT), as Glitter Live writes them (github.com/BuddhaNag12/glitter-live, MIT,
// Copyright (c) 2026 Buddha Nag): see the notice at the end of this file.
import AVFoundation
import CoreImage
import ImageIO
import UniformTypeIdentifiers
import VideoToolbox

var opts: [String: String] = [:]
for a in CommandLine.arguments.dropFirst() where a.hasPrefix("--") {
  let kv = a.dropFirst(2).split(separator: "=", maxSplits: 1).map(String.init)
  opts[kv[0]] = kv.count > 1 ? kv[1] : "1"
}
func fail(_ s: String) -> Never { FileHandle.standardError.write((s + "\n").data(using: .utf8)!); exit(1) }
guard let framesDir = opts["frames"], let stillPath = opts["still"], let out = opts["out"], let key = Int(opts["key"] ?? "") else {
  fail("usage: swift tools/livephoto.swift --frames=<dir> --still=<png> --key=<index> --out=<base> [--fps=30] [--fade=.3] [--fadeIn=s] [--fadeOut=s]")
}
let fps = Int32(opts["fps"] ?? "30")!, fadeS = Double(opts["fade"] ?? ".3")!
let fadeInS = Double(opts["fadeIn"] ?? String(fadeS))!, fadeOutS = Double(opts["fadeOut"] ?? String(fadeS))!
let frameFiles = try FileManager.default.contentsOfDirectory(atPath: framesDir).filter { $0.hasSuffix(".png") }.sorted()
  .map { URL(fileURLWithPath: framesDir).appendingPathComponent($0) }
guard !frameFiles.isEmpty else { fail("no PNG frames in \(framesDir)") }
guard Double(key) / Double(fps) >= 0.5, key < frameFiles.count else { fail("the key frame must be at least 0.5 s in and inside the clip") }

func loadImage(_ url: URL) -> CGImage {
  guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fail("can't read \(url.path)") }
  return img
}
let still = loadImage(URL(fileURLWithPath: stillPath))
let identifier = UUID().uuidString

// ---------- the still: HEIC at full size, the identifier in the maker note ----------
let heicURL = URL(fileURLWithPath: out + ".heic")
try? FileManager.default.removeItem(at: heicURL)
guard let dest = CGImageDestinationCreateWithURL(heicURL as CFURL, UTType.heic.identifier as CFString, 1, nil) else { fail("no HEIC encoder") }
CGImageDestinationAddImage(dest, still, [kCGImagePropertyMakerAppleDictionary: ["17": identifier], kCGImageDestinationLossyCompressionQuality: 0.95] as CFDictionary)
guard CGImageDestinationFinalize(dest) else { fail("HEIC write failed") }

// ---------- QuickTime metadata atoms ----------
extension Data {
  init(hex: String) {
    var b: [UInt8] = []; var i = hex.startIndex
    while i < hex.endIndex { let j = hex.index(i, offsetBy: 2); b.append(UInt8(hex[i..<j], radix: 16)!); i = j }
    self.init(b)
  }
  mutating func be32(_ v: UInt32) { Swift.withUnsafeBytes(of: v.bigEndian) { append(contentsOf: $0) } }
  mutating func be16(_ v: UInt16) { Swift.withUnsafeBytes(of: v.bigEndian) { append(contentsOf: $0) } }
  mutating func beDouble(_ v: Double) { Swift.withUnsafeBytes(of: v.bitPattern.bigEndian) { append(contentsOf: $0) } }
}
func atom(_ type: String, _ payload: Data) -> Data { var d = Data(); d.be32(UInt32(8 + payload.count)); d.append(Data(type.utf8)); d.append(payload); return d }
func atom(key: UInt32, _ payload: Data) -> Data { var d = Data(); d.be32(UInt32(8 + payload.count)); d.be32(key); d.append(payload); return d }
func keyd(_ k: String) -> Data { atom("keyd", Data("mdta".utf8) + Data(k.utf8)) }
func wellKnown(_ t: UInt32) -> Data { var d = Data(); d.be32(0); d.be32(t); return d }
func reverseDNS(_ t: String) -> Data { var d = Data(); d.be32(1); d.append(Data(t.utf8)); return d }
func mebx(_ keys: Data) -> CMFormatDescription {
  var body = Data(count: 6); body.be16(1); body.append(atom("keys", keys))
  let data = atom("mebx", body); var fd: CMFormatDescription?
  let st = data.withUnsafeBytes { CMMetadataFormatDescriptionCreateFromBigEndianMetadataDescriptionData(allocator: kCFAllocatorDefault, bigEndianMetadataDescriptionData: $0.bindMemory(to: UInt8.self).baseAddress!, size: data.count, flavor: nil, formatDescriptionOut: &fd) }
  guard st == noErr, let fd else { fail("metadata format: \(st)") }
  return fd
}
func sample(_ bytes: Data, _ fmt: CMFormatDescription, _ time: CMTime, _ dur: CMTime) -> CMSampleBuffer {
  var block: CMBlockBuffer?
  CMBlockBufferCreateWithMemoryBlock(allocator: kCFAllocatorDefault, memoryBlock: nil, blockLength: bytes.count, blockAllocator: kCFAllocatorDefault, customBlockSource: nil, offsetToData: 0, dataLength: bytes.count, flags: kCMBlockBufferAssureMemoryNowFlag, blockBufferOut: &block)
  _ = bytes.withUnsafeBytes { CMBlockBufferReplaceDataBytes(with: $0.baseAddress!, blockBuffer: block!, offsetIntoDestination: 0, dataLength: bytes.count) }
  var timing = CMSampleTimingInfo(duration: dur, presentationTimeStamp: time, decodeTimeStamp: .invalid), size = bytes.count
  var sb: CMSampleBuffer?
  CMSampleBufferCreateReady(allocator: kCFAllocatorDefault, dataBuffer: block, formatDescription: fmt, sampleCount: 1, sampleTimingEntryCount: 1, sampleTimingArray: &timing, sampleSizeEntryCount: 1, sampleSizeArray: &size, sampleBufferOut: &sb)
  guard let sb else { fail("metadata sample") }
  return sb
}
// the camera's reference values (LivePaper): its capture size, a setup plist naming iPhone OS 17.0, one info record
let cameraSetup = Data(hex:
  "62706c6973743030d301020304050c5f10214c69766550686f746f4d65746164" + "61746153657475704461746156657273696f6e5d53797374656d56657273696f" +
  "6e5f10114672616d65776f726b56657273696f6e731001d3060708090a0b5f10" + "1350726f647563744275696c6456657273696f6e5b50726f647563744e616d65" +
  "5e50726f6475637456657273696f6e583231413532373768596950686f6e6520" + "4f535431372e30d40d0e0f10111213145a436f72654d6f74696f6e5d434d4361" +
  "7074757265436f72655e483130495350536572766963657359436f72654d6564" + "696158323836382e302e32573434362e352e335432302e325e333034352e3639" +
  "2e322e31312e340008000f0033004100550057005e00740080008f009800a200" + "a700b000bb00c900d800e200eb00f300f8000000000000020100000000000000" +
  "1500000000000000000000000000000107")
let cameraInfo = Data(hex:
  "03000000bdc36d3ce3b5eb6d800000007b80ad425a2d64410a08cb3e7feea6bd" + "79e9f63f000080400400ff000000000000000000000000000000000000000000" +
  "07000000525e873ee66e52bf1b2a6ac4d37862bf761ed23dde3f8ec313f52f39" + "b2f04439ff309dbf1a17f1ed1b070000206796ed1b0700000000000000000000" +
  "0000000000000000")
var dims = Data(); dims.be32(1920); dims.be32(1440)
let infoFormat = mebx(atom(key: 1, keyd("com.apple.quicktime.live-photo-info")
  + atom("dtyp", reverseDNS("com.apple.quicktime.com.apple.quicktime.live-photo-info"))
  + atom("setu", atom("cfgv", cameraSetup) + atom("dims", dims))
  + atom("ctps", atom("dtyp", wellKnown(0)))))
let stillFormat = mebx(atom(key: 1, keyd("com.apple.quicktime.still-image-time") + atom("dtyp", wellKnown(0x41)))
  + atom(key: 2, keyd("com.apple.quicktime.live-photo-still-image-transform") + atom("dtyp", wellKnown(0x53))))

// ---------- the movie ----------
let sw = Double(still.width), sh = Double(still.height), scale = min(1, 1920 / max(sw, sh))
let mw = Int((sw * scale / 2).rounded()) * 2, mh = Int((sh * scale / 2).rounded()) * 2
let movURL = URL(fileURLWithPath: out + ".mov")
try? FileManager.default.removeItem(at: movURL)
let writer = try AVAssetWriter(outputURL: movURL, fileType: .mov)
let idItem = AVMutableMetadataItem(); idItem.identifier = .quickTimeMetadataContentIdentifier; idItem.dataType = kCMMetadataBaseDataType_UTF8 as String; idItem.value = identifier as NSString
writer.metadata = [idItem]
let video = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.hevc, AVVideoWidthKey: mw, AVVideoHeightKey: mh,
  AVVideoColorPropertiesKey: [AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2, AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2, AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2],
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 12_000_000, AVVideoProfileLevelKey: kVTProfileLevel_HEVC_Main_AutoLevel as String,
    AVVideoExpectedSourceFrameRateKey: fps, AVVideoMaxKeyFrameIntervalKey: fps, AVVideoAllowFrameReorderingKey: false],
])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: video, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: mw, kCVPixelBufferHeightKey as String: mh])
let infoIn = AVAssetWriterInput(mediaType: .metadata, outputSettings: nil, sourceFormatHint: infoFormat)
let stillIn = AVAssetWriterInput(mediaType: .metadata, outputSettings: nil, sourceFormatHint: stillFormat)
for i in [video, infoIn, stillIn] { i.expectsMediaDataInRealTime = false; guard writer.canAdd(i) else { fail("can't add a track") }; writer.add(i) }
for i in [infoIn, stillIn] where i.canAddTrackAssociation(withTrackOf: video, type: AVAssetTrack.AssociationType.metadataReferent.rawValue) {
  i.addTrackAssociation(withTrackOf: video, type: AVAssetTrack.AssociationType.metadataReferent.rawValue)
}
guard writer.startWriting() else { fail("writer: \(String(describing: writer.error))") }
writer.startSession(atSourceTime: .zero)
let t600 = { (i: Int) in CMTimeConvertScale(CMTime(value: CMTimeValue(i), timescale: fps), timescale: 600, method: .roundHalfAwayFromZero) }
let frameDur = t600(1)
var still600 = Data(); for v in [1.0, 0, 0, 0, 1, 0, 0, 0, 1] { still600.beDouble(v) }
guard stillIn.append(sample(atom(key: 1, Data([0xFF])) + atom(key: 2, still600), stillFormat, t600(key), CMTime(value: 1, timescale: 600))) else { fail("still sample") }
stillIn.markAsFinished()

let n = frameFiles.count, fadeInN = Int(fadeInS * Double(fps)), fadeOutN = Int(fadeOutS * Double(fps))
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
func waitReady(_ i: AVAssetWriterInput) { while !i.isReadyForMoreMediaData { usleep(2000) } }
for (i, url) in frameFiles.enumerated() {
  var pb: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
  guard let pb else { fail("pixel buffer") }
  CVPixelBufferLockBaseAddress(pb, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb), width: mw, height: mh, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb), space: cs,
                      bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
  ctx.interpolationQuality = .high
  let r = CGRect(x: 0, y: 0, width: mw, height: mh)
  ctx.draw(loadImage(url), in: r)
  // blend from the still over the first frames and back into it over the last
  let w = max(fadeInN > 0 ? Double(fadeInN - i) / Double(fadeInN) : 0, fadeOutN > 0 ? Double(i - (n - 1 - fadeOutN)) / Double(fadeOutN) : 0, 0)
  if w > 0 { ctx.setAlpha(CGFloat(min(1, w))); ctx.draw(still, in: r) }
  CVPixelBufferUnlockBaseAddress(pb, [])
  waitReady(video)
  guard adaptor.append(pb, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: fps)) else { fail("frame \(i): \(String(describing: writer.error))") }
  waitReady(infoIn)
  guard infoIn.append(sample(atom(key: 1, cameraInfo), infoFormat, t600(i), frameDur)) else { fail("info \(i)") }
}
video.markAsFinished(); infoIn.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard writer.status == .completed else { fail("finish: \(String(describing: writer.error))") }
print("\(out).heic + \(out).mov  (\(mw)×\(mh), \(n) frames at \(fps) fps, still at \(String(format: "%.2f", Double(key) / Double(fps))) s, id \(identifier))")

// LivePaper's notice (the metadata layout and the camera's reference values above):
// MIT License. Copyright (c) 2026 Yuyang Zeng. Glitter Live: MIT License, Copyright (c) 2026 Buddha Nag.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
// and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
