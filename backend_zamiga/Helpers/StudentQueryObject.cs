namespace backend_zamiga.Helpers
{
    public class StudentQueryObject
    {
        // Tham số tìm kiếm
        public string? SearchCode { get; set; } = null;
        public string? SearchName { get; set; } = null;
        public string? SearchClass { get; set; } = null;
        public string? SearchMajor { get; set; } = null;

        public string? SortBy { get; set; } = null; 
        public string? SortOrder { get; set; } = "asc"; 
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10; 
    }
}