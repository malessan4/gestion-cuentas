# Base image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Build image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
# Copy the project file and restore dependencies
COPY ["MiniCoreBancario.csproj", "./"]
RUN dotnet restore "MiniCoreBancario.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/"
RUN dotnet build "MiniCoreBancario.csproj" -c Release -o /app/build

# Publish image
FROM build AS publish
RUN dotnet publish "MiniCoreBancario.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# The sqlite database will be created in the /app directory when EF Core runs or when the app is started.
ENTRYPOINT ["dotnet", "MiniCoreBancario.dll"]
