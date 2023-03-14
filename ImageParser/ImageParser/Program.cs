using System.Diagnostics;
using Dicom.Media;
using Dicom.Imaging;
using System.Text;
using SixLabors.ImageSharp.Formats.Jpeg;
using FellowOakDicom;

namespace DicomDirReader;

public class Program
{
    private static readonly string PathToDicomFolder = "/Users/michau/Documents/DICOMs/DICOM_PILINSKI";
    private static readonly string PathToDirFile = Path.Combine(PathToDicomFolder, "DICOMDIR");

    static void Main(string[] args)
    {
        Dicom.Imaging.ImageManager.SetImplementation(new Dicom.Imaging.ImageSharpImageManager());

        var dicomDir = GetDicomDir();

        var study = dicomDir?.RootDirectoryRecord?.LowerLevelDirectoryRecord;

        if (study is null)
        {
            Debug.WriteLine("Could not select study!");
            throw new Exception("Could not select study!");
        }

        foreach (var series in study.LowerLevelDirectoryRecordCollection)
        {
            var seriesDirPath = CreateSeriesDirectory(series);
            var seriesPaths = MapImagesToPath(series)
                .Select(subpath => subpath.Replace('\\', '/'))
                .Select(subpath => Path.GetFullPath(subpath, PathToDicomFolder));

            int namingItx = 0;
            foreach (var path in seriesPaths)
            {
                if(seriesDirPath.Contains("SUMMARY")) continue;
                Debug.WriteLine(path);
                SaveDicomToPng(path, seriesDirPath, namingItx);

                namingItx++;
            }
        }
    }

    private static DicomDirectory GetDicomDir()
    {
        Debug.WriteLine("Opening DicomDir file...");

        try
        {
            var dicomDirectory = DicomDirectory.Open(PathToDirFile);
            Debug.WriteLine("DicomDir opened.");

            return dicomDirectory;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Could not open DicomDir file. Error massage: {ex.Message}");
            throw;
        }
    }

    private static string CreateSeriesDirectory(DicomDirectoryRecord series)
    {
        var seriesName = series.GetSingleValue<string>(Dicom.DicomTag.SeriesDescription);
        var seriesDirName = String.Concat(seriesName.Where(c => !Char.IsWhiteSpace(c)));

        var seriesDirPath = Path.Combine(PathToDicomFolder, seriesDirName);

        Debug.WriteLine("Creating series directory...");
        try
        {
            _ = Directory.CreateDirectory(seriesDirPath);
        }
        catch
        {
            Debug.WriteLine($"Could not create directory for series: {seriesName}!");
            throw;
        }
        Debug.WriteLine("Created.");

        return seriesDirPath;
    }

    private static IEnumerable<string> MapImagesToPath(DicomDirectoryRecord series)
    {
        return series.LowerLevelDirectoryRecordCollection.Select(img => img.GetString(Dicom.DicomTag.ReferencedFileID));
    }

    private static void SaveDicomToPng(string dicomPath, string outputPath, int imgNumber)
    {
        var image = new DicomImage(dicomPath);

        var iImage = image.RenderImage();

        if (iImage is null) return;
        var sharpImage = iImage.AsSharpImage();

        using FileStream file = new($"{outputPath}/kanapka{imgNumber}.bmp", FileMode.Create, FileAccess.Write);
        sharpImage.Save(file, new JpegEncoder());
    }
}

