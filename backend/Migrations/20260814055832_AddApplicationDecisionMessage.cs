using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPlatform.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationDecisionMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DecisionMessage",
                table: "Applications",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DecisionMessage",
                table: "Applications");
        }
    }
}
